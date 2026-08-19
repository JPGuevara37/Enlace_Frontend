import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Servicios/api/api.service';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { IListaMateriales } from '../../modelos/IListaMateriales';

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css'],
})
export class MaterialComponent implements OnInit {
  materiales: IListaMateriales[] = [];
  puedeSubir = false;
  cargando = true;

  archivoSeleccionado: File | null = null;
  nombreNuevo = '';

  editandoId: string | null = null;
  editNombre = '';
  editDescripcion = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private alertas: AlertasService,
  ) {}

  ngOnInit(): void {
    this.puedeSubir = ['administrador', 'lidere'].includes(this.api.getRole());
    this.cargarMateriales();
  }

  cargarMateriales(): void {
    this.cargando = true;
    this.api.getAllMateriales(1).subscribe({
      next: (data) => {
        this.materiales = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando materiales', err);
        this.cargando = false;
      },
    });
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.archivoSeleccionado = input.files?.[0] ?? null;
  }

  subirMaterial(): void {
    if (!this.archivoSeleccionado) {
      this.alertas.showError('Selecciona un archivo PDF', 'Error');
      return;
    }

    const fd = new FormData();
    fd.append('archivo', this.archivoSeleccionado, this.archivoSeleccionado.name);
    if (this.nombreNuevo.trim()) {
      fd.append('nombre', this.nombreNuevo.trim());
    }

    this.api.subirMaterial(fd).subscribe({
      next: () => {
        this.alertas.showSuccess('Material subido', 'Hecho');
        this.nombreNuevo = '';
        this.archivoSeleccionado = null;
        this.cargarMateriales();
      },
      error: (err) => {
        const msg = err?.error?.result?.mensaje || 'No se pudo subir el material';
        this.alertas.showError(msg, 'Error');
      },
    });
  }

  descargar(m: IListaMateriales): void {
    this.api.descargarMaterial(m.materialId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = m.nombre || 'material.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      error: () => this.alertas.showError('No se pudo descargar el material', 'Error'),
    });
  }

  empezarEdicion(m: IListaMateriales): void {
    this.editandoId = m.materialId;
    this.editNombre = m.nombre || '';
    this.editDescripcion = m.descripcion || '';
  }

  cancelarEdicion(): void {
    this.editandoId = null;
  }

  guardarEdicion(m: IListaMateriales): void {
    this.api
      .putMateriales({
        materialId: m.materialId,
        nombre: this.editNombre,
        descripcion: this.editDescripcion,
      })
      .subscribe({
        next: () => {
          this.alertas.showSuccess('Material actualizado', 'Hecho');
          this.editandoId = null;
          this.cargarMateriales();
        },
        error: () => this.alertas.showError('No se pudo actualizar', 'Error'),
      });
  }

  eliminar(m: IListaMateriales): void {
    if (!window.confirm('¿Eliminar este material?')) {
      return;
    }

    this.api.deleteMateriales(m.materialId).subscribe({
      next: () => {
        this.alertas.showSuccess('Material eliminado', 'Hecho');
        this.cargarMateriales();
      },
      error: () => this.alertas.showError('No se pudo eliminar', 'Error'),
    });
  }

  formatearFecha(fecha: Date | string): string {
    const d = new Date(fecha);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatearTamano(bytes?: number): string {
    if (!bytes) {
      return '';
    }
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
