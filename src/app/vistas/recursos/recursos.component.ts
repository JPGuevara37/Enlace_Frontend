import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ApiService } from '../../Servicios/api/api.service';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { IListaRecursos } from '../../modelos/listarecursos.interfase';
import { IMaterialClase } from '../../modelos/material-clase.interfase';

const CLASES = ['Legado', 'Aspirantes', 'Retoñitos', 'Semillitas'];

const CLASE_INFO: Record<string, { icono: string; color: string }> = {
  Legado: { icono: 'fa-solid fa-people-roof', color: '#005a65' },
  Aspirantes: { icono: 'fa-solid fa-child-reaching', color: '#1cc88a' },
  Retoñitos: { icono: 'fa-solid fa-sprout', color: '#f6c23e' },
  Semillitas: { icono: 'fa-solid fa-leaf', color: '#36b9cc' },
};

@Component({
  selector: 'app-recursos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recursos.component.html',
  styleUrl: './recursos.component.css'
})
export class RecursosComponent implements OnInit {

  materiales: IListaRecursos[] = [];
  asignaciones: IMaterialClase[] = [];
  clases = CLASES;

  filtroNombre = '';
  cargando = true;
  errorCarga = false;

  modalAsignacion = false;
  editandoAsignacion: IMaterialClase | null = null;
  asignacionRecursoId = '';
  asignacionClase = 'Legado';
  asignacionCantidad = 1;

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef, private alertas: AlertasService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.errorCarga = false;
    this.api.getAllRecursos(1).subscribe({
      next: data => {
        this.materiales = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.errorCarga = true;
        this.cdr.detectChanges();
      },
    });
    this.cargarAsignaciones();
  }

  cargarAsignaciones(): void {
    this.api.getMaterialesClase().subscribe({
      next: data => {
        this.asignaciones = data;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  get materialesFiltrados(): IListaRecursos[] {
    const q = this.quitarTildes(this.filtroNombre.trim().toLowerCase());
    return this.materiales.filter(m => !q || this.quitarTildes((m.articulo || '').toLowerCase()).includes(q));
  }

  asignacionesDeClase(clase: string): { asignacion: IMaterialClase; material?: IListaRecursos }[] {
    return this.asignaciones
      .filter(a => a.clase === clase)
      .map(a => ({ asignacion: a, material: this.materiales.find(m => m.recursosId === a.recursoId) }));
  }

  nombreMaterial(recursoId: string): string {
    return this.materiales.find(m => m.recursosId === recursoId)?.articulo || '—';
  }

  infoClase(clase: string): { icono: string; color: string } {
    return CLASE_INFO[clase] || { icono: 'fa-solid fa-children', color: '#36b9cc' };
  }

  abrirAsignacion(clase: string, asignacion?: IMaterialClase): void {
    this.editandoAsignacion = asignacion || null;
    if (asignacion) {
      this.asignacionRecursoId = asignacion.recursoId;
      this.asignacionClase = asignacion.clase;
      this.asignacionCantidad = asignacion.cantidad;
    } else {
      this.asignacionRecursoId = this.materiales[0]?.recursosId || '';
      this.asignacionClase = clase;
      this.asignacionCantidad = 1;
    }
    this.modalAsignacion = true;
  }

  cerrarAsignacion(): void {
    this.modalAsignacion = false;
    this.editandoAsignacion = null;
  }

  guardarAsignacion(): void {
    if (!this.asignacionRecursoId) {
      return;
    }
    const item: IMaterialClase = {
      recursoId: this.asignacionRecursoId,
      clase: this.asignacionClase,
      cantidad: Number(this.asignacionCantidad) || 0,
    };
    if (this.editandoAsignacion?.materialClaseId) {
      this.api.actualizarMaterialClase(this.editandoAsignacion.materialClaseId, item).subscribe({
        next: () => {
          this.alertas.showSuccess('Asignación actualizada', 'Hecho');
          this.cerrarAsignacion();
          this.cargarAsignaciones();
        },
        error: () => this.alertas.showError('No se pudo guardar', 'Error'),
      });
    } else {
      this.api.crearMaterialClase(item).subscribe({
        next: () => {
          this.alertas.showSuccess('Material asignado', 'Hecho');
          this.cerrarAsignacion();
          this.cargarAsignaciones();
        },
        error: () => this.alertas.showError('No se pudo asignar', 'Error'),
      });
    }
  }

  quitarAsignacion(a: IMaterialClase): void {
    if (!a.materialClaseId) {
      return;
    }
    if (!window.confirm('¿Quitar esta asignación?')) {
      return;
    }
    this.api.borrarMaterialClase(a.materialClaseId).subscribe({
      next: () => {
        this.alertas.showSuccess('Asignación eliminada', 'Hecho');
        this.cargarAsignaciones();
      },
      error: () => this.alertas.showError('No se pudo quitar', 'Error'),
    });
  }

  nuevoMaterial(): void {
    this.router.navigate(['nuevo-recursos']);
  }

  editarMaterial(m: IListaRecursos): void {
    this.router.navigate(['editar-recursos', m.recursosId]);
  }

  borrarMaterial(m: IListaRecursos): void {
    if (!window.confirm(`¿Eliminar el material "${m.articulo}"?`)) {
      return;
    }
    this.api.deleteRecurso(m as any).subscribe({
      next: () => {
        this.alertas.showSuccess('Material eliminado', 'Hecho');
        this.cargar();
      },
      error: () => this.alertas.showError('No se pudo eliminar', 'Error'),
    });
  }

  exportToExcel(): void {
    if (this.materiales && this.materiales.length > 0) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
      const dataToExport = this.materiales.map(m => ({
        Artículo: m.articulo,
        Locker: m.numero_Locker,
        Descripción: m.descripcion,
      }));
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Materiales');
      XLSX.writeFile(wb, `materiales${formattedDate}.xlsx`);
    }
  }

  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
