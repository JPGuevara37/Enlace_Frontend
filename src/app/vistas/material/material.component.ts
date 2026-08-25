import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaMateriales } from '../../modelos/IListaMateriales';

interface Tarjeta {
  nombre: string;
  icono: string;
  color: string;
  descripcion: string;
  cantidad: number;
}

const CLASES: Omit<Tarjeta, 'cantidad'>[] = [
  { nombre: 'Legado', icono: 'fa-solid fa-people-roof', color: '#4e73df', descripcion: 'Material de la clase Legado' },
  { nombre: 'Aspirantes', icono: 'fa-solid fa-child-reaching', color: '#1cc88a', descripcion: 'Material de la clase Aspirantes' },
  { nombre: 'Retoñitos', icono: 'fa-solid fa-sprout', color: '#f6c23e', descripcion: 'Material de la clase Retoñitos' },
  { nombre: 'Pampanitos', icono: 'fa-solid fa-seedling', color: '#e74a3b', descripcion: 'Material de la clase Pampanitos' },
  { nombre: 'Semillitas', icono: 'fa-solid fa-leaf', color: '#36b9cc', descripcion: 'Material de la clase Semillitas' },
];

const COLORES_OTROS = ['#6f42c1', '#fd7e14', '#0e9aa7', '#d63384'];

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css'],
})
export class MaterialComponent implements OnInit {
  meses = MESES;

  materiales: IListaMateriales[] = [];
  tarjetaSeleccionada: Tarjeta | null = null;
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

  get tarjetas(): Tarjeta[] {
    const porCategoria = new Map<string, IListaMateriales[]>();
    this.materiales.forEach(m => {
      const c = (m.categoria || '').trim() || 'Sin categoría';
      if (!porCategoria.has(c)) {
        porCategoria.set(c, []);
      }
      porCategoria.get(c)!.push(m);
    });

    const tarjetas: Tarjeta[] = CLASES.map(clase => ({
      ...clase,
      cantidad: porCategoria.get(clase.nombre)?.length ?? 0,
    }));

    Array.from(porCategoria.keys())
      .filter(c => !CLASES.some(cl => cl.nombre === c))
      .sort()
      .forEach((c, i) => {
        tarjetas.push({
          nombre: c,
          icono: 'fa-solid fa-folder',
          color: COLORES_OTROS[i % COLORES_OTROS.length],
          descripcion: 'Materiales variados',
          cantidad: porCategoria.get(c)!.length,
        });
      });

    return tarjetas;
  }

  get materialesCategoria(): IListaMateriales[] {
    if (!this.tarjetaSeleccionada) {
      return [];
    }
    return this.materiales.filter(m => (m.categoria || '').trim() === this.tarjetaSeleccionada!.nombre);
  }

  get esClase(): boolean {
    return !!this.tarjetaSeleccionada && CLASES.some(cl => cl.nombre === this.tarjetaSeleccionada!.nombre);
  }

  get tieneFechas(): boolean {
    return this.materialesCategoria.some(m => m.mes != null && m.anno != null);
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

  tituloGrupo(grupo: { anno: number; mes: number; dia: number }): string {
    return grupo.mes ? `Día ${grupo.dia} · ${this.nombreMes(grupo.mes)} ${grupo.anno}` : 'Sin fecha';
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

  seleccionarTarjeta(tarjeta: Tarjeta): void {
    this.tarjetaSeleccionada = tarjeta;
    this.mostrarUpload = false;
  }

  volver(): void {
    this.tarjetaSeleccionada = null;
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
    if (this.tarjetaSeleccionada) {
      fd.append('categoria', this.tarjetaSeleccionada.nombre);
    }
    if (this.esClase) {
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
    if (this.esClase) {
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
