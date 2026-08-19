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
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'es' }]
})
export class AlumnosComponent implements OnInit {

  alumnos: IListaAlumnos[] = [];
  encargados: IListaEcargados[] | undefined;
  edades: IListaEdades[] | undefined;

  filtroNombre: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  maxSize: number = 3;
  totalItems: number = 0;

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
      this.filtrarEncargados();
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
      this.totalItems = this.alumnos.length;
      this.cdr.detectChanges();
    });
  }

  borrarAlumno(alumno: IListaAlumnos): void {
    if (!window.confirm('¿Eliminar este alumno?')) {
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

  filtrarEncargados() {
    if (this.encargados && this.encargados.length > 0) {
      this.alumnos = this.alumnos?.map(alumno => ({
        ...alumno,
        nombreEncargado: this.getNombreEncargado(alumno.encargadoId)
      }));
    }
  }

  editarAlumnos(id: any) {
    this.router.navigate(['editar-alumnos', id]);
  }

  guardarAlumno(alumno: IListaAlumnos) {
    this.api.putAlumnos(alumno).subscribe({
      next: () => this.alertas.showSuccess('Datos guardados', 'Hecho'),
      error: () => this.alertas.showError('No se pudo guardar', 'Error'),
    });
  }

  formatFecha(fecha: string): string {
    return fecha ? fecha.slice(0, 10) : '';
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

  onFechaChange(alumno: IListaAlumnos, event: Event): void {
    const input = event.target as HTMLInputElement;
    alumno.fechaNacimiento = input.value;
    this.guardarAlumno(alumno);
  }

  nuevoAlumnos() {
    this.router.navigate(['nuevo-alumnos']);
  }

  filtrar() {
    this.api.getAllAlumnos(1).subscribe(data => {
      const filtroSinTildes = this.quitarTildes(this.filtroNombre.toLowerCase());

      this.alumnos = data.filter(alumno =>
        this.quitarTildes(alumno.nombre.toLowerCase()).includes(filtroSinTildes) ||
        this.quitarTildes(alumno.apellido.toLowerCase()).includes(filtroSinTildes)
      );
      this.cdr.detectChanges();
    });
  }

  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  salir() {
    this.router.navigate(['dashboard']);
  }

  getNombreEncargado(encargadoId: string): string {
    const encargado = this.encargados?.find(e => e.encargadoId === encargadoId);
    return encargado ? `${encargado.nombre} ${encargado.apellido}` : '';
  }

  getTelefonoEncargado(encargadoId: string): string {
    const encargado = this.encargados?.find(e => e.encargadoId === encargadoId);
    return encargado ? `${encargado.telefono}` : '';
  }

  getEmailEncargado(encargadoId: string): string {
    const encargado = this.encargados?.find(e => e.encargadoId === encargadoId);
    return encargado ? `${encargado.email}` : '';
  }

  getDireccionEncargado(encargadoId: string): string {
    let encargado = this.encargados?.find(e => e.encargadoId === encargadoId);
    return encargado ? `${encargado.direccion}` : '';
  }

  getEdadClase(edadId: string): string {
    const edades = this.edades?.find(e => e.edadId === edadId);
    return edades ? `${edades.rangoEdad}` : '';
  }

  formatDate(fecha: string): string {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy') || '';
  }

  formatDateEs(fecha: string): string {
    return this.datePipe.transform(fecha, 'dd \'de\' MMMM \'del\' yyyy') || '';
  }

  exportToExcel(): void {
    if (this.alumnos && this.alumnos.length > 0) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');

      const dataToExport = this.alumnos.map(alumno => ({
        Nombre: alumno.nombre,
        Apellido: alumno.apellido,
        FechaNacimiento: this.formatDateEs(alumno.fechaNacimiento),
        Direccion: this.getDireccionEncargado(alumno.encargadoId),
        Email: this.getEmailEncargado(alumno.encargadoId),
        Telefono: this.getTelefonoEncargado(alumno.encargadoId),
        Padre: this.getNombreEncargado(alumno.encargadoId),
        Clase: this.getEdadClase(alumno.edadId)
      }));

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');
      XLSX.writeFile(wb, `alumnos_${formattedDate}.xlsx`);
    }
  }

  pageChanged(event: any): void {
    this.currentPage = event;
  }
}
