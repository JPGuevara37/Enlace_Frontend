import { ChangeDetectorRef, Component, LOCALE_ID, OnInit } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import * as XLSX from 'xlsx';
import localeEs from '@angular/common/locales/es';
import { ApiService } from '../../Servicios/api/api.service';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { IListaAlumnos } from '../../modelos/listaalumnos.interfase';
import { IListaEcargados } from '../../modelos/listaencargados.interfase';
import { IListaEdades } from '../../modelos/listaedades.interfase';

registerLocaleData(localeEs);

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [FormsModule, NgxPaginationModule],
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css'],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'es' }],
})
export class AlumnosComponent implements OnInit {
  alumnos: IListaAlumnos[] = [];
  encargados: IListaEcargados[] | undefined;
  edades: IListaEdades[] | undefined;

  filtroNombre = '';
  filtroClase = '';

  seleccionados = new Set<string>();

  detalle: IListaAlumnos | null = null;
  editando: IListaAlumnos | null = null;
  editEncargadoId = '';
  editEdadId = '';

  itemsPerPage = 10;
  currentPage = 1;
  maxSize = 50;
  totalItems = 0;

  constructor(
    private api: ApiService,
    private router: Router,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private alertas: AlertasService,
  ) {}

  ngOnInit(): void {
    this.cargarAlumnos();
    this.api.getAllEncargados(1).subscribe(data => {
      this.encargados = data;
      this.cdr.detectChanges();
    });
    this.api.getAllEdades(1).subscribe(data => {
      this.edades = data;
      this.cdr.detectChanges();
    });
  }

  cargarAlumnos(): void {
    this.api.getAllAlumnos(1).subscribe(data => {
      this.alumnos = data;
      this.totalItems = data.length;
      this.cdr.detectChanges();
    });
  }

  get alumnosFiltrados(): IListaAlumnos[] {
    const q = this.quitarTildes(this.filtroNombre.trim().toLowerCase());
    return this.alumnos.filter(a => {
      const nombre = this.quitarTildes(`${a.nombre} ${a.apellido}`.toLowerCase());
      const coincideNombre = !q || nombre.includes(q);
      const coincideClase = !this.filtroClase || a.edadId === this.filtroClase;
      return coincideNombre && coincideClase;
    });
  }

  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroClase = '';
  }

  // Selección múltiple
  get todosSeleccionados(): boolean {
    return this.alumnosFiltrados.length > 0 && this.alumnosFiltrados.every(a => this.seleccionados.has(a.alumnoId));
  }

  toggleSeleccion(id: string): void {
    if (this.seleccionados.has(id)) {
      this.seleccionados.delete(id);
    } else {
      this.seleccionados.add(id);
    }
  }

  toggleSeleccionarTodos(): void {
    if (this.todosSeleccionados) {
      this.alumnosFiltrados.forEach(a => this.seleccionados.delete(a.alumnoId));
    } else {
      this.alumnosFiltrados.forEach(a => this.seleccionados.add(a.alumnoId));
    }
  }

  get haySeleccionados(): boolean {
    return this.seleccionados.size > 0;
  }

  eliminarSeleccionados(): void {
    const ids = Array.from(this.seleccionados);
    if (!ids.length) {
      return;
    }
    if (!window.confirm(`¿Eliminar ${ids.length} alumno(s)?`)) {
      return;
    }
    let pendientes = ids.length;
    let errores = 0;
    ids.forEach(id => {
      this.api.deleteAlumnos({ alumnoId: id } as any).subscribe({
        next: () => {
          pendientes--;
          if (pendientes === 0) this.finalizarEliminacion(errores);
        },
        error: () => {
          errores++;
          pendientes--;
          if (pendientes === 0) this.finalizarEliminacion(errores);
        },
      });
    });
  }

  private finalizarEliminacion(errores: number): void {
    this.seleccionados.clear();
    this.cargarAlumnos();
    if (errores) {
      this.alertas.showError(`No se pudieron eliminar ${errores} registro(s)`, 'Error');
    } else {
      this.alertas.showSuccess('Eliminado(s) correctamente', 'Hecho');
    }
  }

  // Detalle
  verDetalle(alumno: IListaAlumnos): void {
    this.detalle = alumno;
  }

  cerrarDetalle(): void {
    this.detalle = null;
  }

  // Edición
  editar(alumno: IListaAlumnos): void {
    this.editando = { ...alumno };
    this.editEncargadoId = alumno.encargadoId;
    this.editEdadId = alumno.edadId;
  }

  cerrarEdicion(): void {
    this.editando = null;
  }

  onEditFecha(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.editando) {
      this.editando.fechaNacimiento = input.value;
    }
  }

  guardarEdicion(): void {
    if (!this.editando) {
      return;
    }
    this.editando.encargadoId = this.editEncargadoId;
    this.editando.edadId = this.editEdadId;
    this.api.putAlumnos(this.editando).subscribe({
      next: () => {
        this.alertas.showSuccess('Datos guardados', 'Hecho');
        this.editando = null;
        this.cargarAlumnos();
      },
      error: () => this.alertas.showError('No se pudo guardar', 'Error'),
    });
  }

  borrarAlumno(alumno: IListaAlumnos): void {
    if (!window.confirm(`¿Eliminar a ${alumno.nombre} ${alumno.apellido}?`)) {
      return;
    }
    this.api.deleteAlumnos(alumno as any).subscribe({
      next: () => {
        this.alertas.showSuccess('Alumno eliminado', 'Hecho');
        this.cargarAlumnos();
      },
      error: () => this.alertas.showError('No se pudo eliminar', 'Error'),
    });
  }

  nuevoAlumno(): void {
    this.router.navigate(['nuevo-alumnos']);
  }

  // Helpers
  getNombreEncargado(encargadoId: string): string {
    const encargado = this.encargados?.find(e => e.encargadoId === encargadoId);
    return encargado ? `${encargado.nombre} ${encargado.apellido}` : '—';
  }

  getTelefonoEncargado(encargadoId: string): string {
    const encargado = this.encargados?.find(e => e.encargadoId === encargadoId);
    return encargado ? encargado.telefono : '—';
  }

  getEmailEncargado(encargadoId: string): string {
    const encargado = this.encargados?.find(e => e.encargadoId === encargadoId);
    return encargado ? encargado.email : '—';
  }

  getEdadClase(edadId: string): string {
    const edad = this.edades?.find(e => e.edadId === edadId);
    return edad ? edad.rangoEdad : '—';
  }

  calcularEdad(fechaNacimiento: string): string {
    if (!fechaNacimiento) {
      return '';
    }
    const nacimiento = new Date(fechaNacimiento);
    if (isNaN(nacimiento.getTime())) {
      return '';
    }
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad >= 0 ? `${edad} años` : '';
  }

  formatFecha(fecha: string): string {
    return fecha ? fecha.slice(0, 10) : '';
  }

  formatDateEs(fecha: string): string {
    return this.datePipe.transform(fecha, "dd 'de' MMMM 'del' yyyy") || '';
  }

  exportToExcel(): void {
    if (!this.alumnos || !this.alumnos.length) {
      return;
    }
    const formattedDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const dataToExport = this.alumnos.map(alumno => ({
      Nombre: alumno.nombre,
      Apellido: alumno.apellido,
      FechaNacimiento: this.formatDateEs(alumno.fechaNacimiento),
      Edad: this.calcularEdad(alumno.fechaNacimiento),
      Padre: this.getNombreEncargado(alumno.encargadoId),
      Clase: this.getEdadClase(alumno.edadId),
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');
    XLSX.writeFile(wb, `alumnos_${formattedDate}.xlsx`);
  }

  pageChanged(event: any): void {
    this.currentPage = event;
  }
}
