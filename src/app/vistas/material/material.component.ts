import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaMateriales } from '../../modelos/IListaMateriales';

const CATEGORIAS = ['Clases Enlace', 'Material de apoyo', 'Talleres'];

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css'],
})
export class MaterialComponent implements OnInit {
  categorias = CATEGORIAS;
  meses = MESES;

  materiales: IListaMateriales[] = [];
  categoriaSeleccionada: string | null = null;
  puedeSubir = false;
  cargando = true;

  mostrarUpload = false;
  archivoSeleccionado: File | null = null;
  nombreNuevo = '';
  mesNuevo = 1;
  annoNuevo = new Date().getFullYear();
  diaNuevo = 1;

  editando: IListaMateriales | null = null;
  editNombre = '';
  editDescripcion = '';
  editMes = 1;
  editAnno = new Date().getFullYear();
  editDia = 1;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.puedeSubir = ['administrador', 'lidere'].includes(this.api.getRole());
    this.cargarMateriales();
  }

  cargarMateriales(): void {
    this.cargando = true;
    this.api.getAllMateriales(1).subscribe({
      next: data => {
        this.materiales = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

  get materialesCategoria(): IListaMateriales[] {
    return this.materiales.filter(m => (m.categoria || '') === this.categoriaSeleccionada);
  }

  get esClasesEnlace(): boolean {
    return this.categoriaSeleccionada === 'Clases Enlace';
  }

  get gruposClases(): { anno: number; mes: number; dia: number; items: IListaMateriales[] }[] {
    const grupos = new Map<string, { anno: number; mes: number; dia: number; items: IListaMateriales[] }>();
    this.materialesCategoria.forEach(m => {
      const anno = m.anno ?? 0;
      const mes = m.mes ?? 0;
      const dia = m.dia ?? 0;
      const clave = `${anno}-${mes}-${dia}`;
      if (!grupos.has(clave)) {
        grupos.set(clave, { anno, mes, dia, items: [] });
      }
      grupos.get(clave)!.items.push(m);
    });
    return Array.from(grupos.values()).sort((a, b) => (b.anno - a.anno) || (b.mes - a.mes) || (b.dia - a.dia));
  }

  nombreMes(mes: number): string {
    return this.meses[mes - 1] || `Mes ${mes}`;
  }

  obtenerDomingos(mes: number, anno: number): number[] {
    const domingos: number[] = [];
    const diasEnMes = new Date(anno, mes, 0).getDate();
    for (let d = 1; d <= diasEnMes; d++) {
      if (new Date(anno, mes - 1, d).getDay() === 0) {
        domingos.push(d);
      }
    }
    return domingos;
  }

  get domingosNuevo(): number[] {
    return this.obtenerDomingos(this.mesNuevo, this.annoNuevo);
  }

  get domingosEdit(): number[] {
    return this.obtenerDomingos(this.editMes, this.editAnno);
  }

  formatearDomingo(dia: number, mes: number, anno: number): string {
    const fecha = new Date(anno, mes - 1, dia);
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  onMesNuevoChange(): void {
    this.diaNuevo = this.obtenerDomingos(this.mesNuevo, this.annoNuevo)[0] || 1;
  }

  onAnnoNuevoChange(): void {
    this.diaNuevo = this.obtenerDomingos(this.mesNuevo, this.annoNuevo)[0] || 1;
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    this.mostrarUpload = false;
  }

  volver(): void {
    this.categoriaSeleccionada = null;
    this.mostrarUpload = false;
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.archivoSeleccionado = input.files?.[0] ?? null;
  }

  subirMaterial(): void {
    if (!this.archivoSeleccionado) {
      return;
    }
    const fd = new FormData();
    fd.append('archivo', this.archivoSeleccionado, this.archivoSeleccionado.name);
    if (this.nombreNuevo.trim()) {
      fd.append('nombre', this.nombreNuevo.trim());
    }
    if (this.categoriaSeleccionada) {
      fd.append('categoria', this.categoriaSeleccionada);
    }
    if (this.esClasesEnlace) {
      fd.append('mes', String(this.mesNuevo));
      fd.append('anno', String(this.annoNuevo));
      fd.append('dia', String(this.diaNuevo));
    }

    this.api.subirMaterial(fd).subscribe({
      next: () => {
        this.nombreNuevo = '';
        this.archivoSeleccionado = null;
        this.mostrarUpload = false;
        this.cargarMateriales();
      },
      error: () => {},
    });
  }

  descargar(m: IListaMateriales): void {
    this.api.descargarMaterial(m.materialId).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = m.nombre || 'material.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      error: () => {},
    });
  }

  editar(m: IListaMateriales): void {
    this.editando = { ...m };
    this.editNombre = m.nombre || '';
    this.editDescripcion = m.descripcion || '';
    this.editMes = m.mes || 1;
    this.editAnno = m.anno || new Date().getFullYear();
    this.editDia = m.dia || 1;
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  guardarEdicion(): void {
    if (!this.editando) {
      return;
    }
    this.editando.nombre = this.editNombre;
    this.editando.descripcion = this.editDescripcion;
    if (this.esClasesEnlace) {
      this.editando.mes = this.editMes;
      this.editando.anno = this.editAnno;
      this.editando.dia = this.editDia;
    }
    this.api.putMateriales(this.editando).subscribe({
      next: () => {
        this.editando = null;
        this.cargarMateriales();
      },
      error: () => {},
    });
  }

  eliminar(m: IListaMateriales): void {
    if (!window.confirm('¿Eliminar este material?')) {
      return;
    }
    this.api.deleteMateriales(m.materialId).subscribe({
      next: () => this.cargarMateriales(),
      error: () => {},
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
