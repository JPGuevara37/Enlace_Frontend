import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { ApiService } from '../../Servicios/api/api.service';
import { Router } from '@angular/router';
import { DatePipe, getLocaleDateFormat } from '@angular/common';

import { IListaAlumnos } from '../../modelos/listaalumnos.interfase';
import { IListaEcargados } from '../../modelos/listaencargados.interfase';
import { IListaEdades } from '../../modelos/listaedades.interfase';

import * as XLSX from 'xlsx';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { PaginatePipe } from 'ngx-pagination';


registerLocaleData(localeEs);

@Component({
  selector: 'app-alumnos',
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
  maxSize: number = 50; // Puedes ajustar el tamaño máximo de la paginación aquí
  totalItems: number = 0; // Esta se actualizará con el total de elementos


  constructor(
    private api: ApiService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // Obtener la lista de alumnos al inicializar el componente
    this.api.getAllAlumnos(1).subscribe(data => {
      console.log(data);
      this.alumnos = data;
      this.totalItems = this.alumnos.length;
    });

    // Obtener la lista de encargados al inicializar el componente
    this.api.getAllEncargados(1).subscribe(data => {
      this.encargados = data;
      console.log('Encargados:', this.encargados);
      
      // Lógica de filtrado después de obtener los encargados
      this.filtrarEncargados();
    });

    // Obtener la lista de edades al inicializar el componente
    this.api.getAllEdades(1).subscribe(data => {
      this.edades = data;
    });
  }

  // Filtrar la lista de encargados por el nombre o apellido ingresado en el filtro
  filtrarEncargados() {
    if (this.encargados && this.encargados.length > 0) {
      this.alumnos = this.alumnos?.map(alumno => ({
        ...alumno,
        nombreEncargado: this.getNombreEncargado(alumno.encargadoId)
      }));
    }
  }

  // Redirigir a la página de editar alumno
  editarAlumnos(id: any) {
    this.router.navigate(['editar-alumnos', id]);
  }

  // Redirigir a la página de nuevo alumno
  nuevoAlumnos() {
    this.router.navigate(['nuevo-alumnos']);
  }

  // Filtrar la lista de alumnos por el nombre o apellido ingresado en el filtro
  filtrar() {
    this.api.getAllAlumnos(1).subscribe(data => {
      const filtroSinTildes = this.quitarTildes(this.filtroNombre.toLowerCase());

      this.alumnos = data.filter(alumno =>
        this.quitarTildes(alumno.nombre.toLowerCase()).includes(filtroSinTildes) ||
        this.quitarTildes(alumno.apellido.toLowerCase()).includes(filtroSinTildes)
      );
    });
  }

  // Quitar tildes de un texto
  quitarTildes(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Redirigir a la página de dashboard
  salir() {
    this.router.navigate(['dashboard']);
  }

  // Obtener el nombre completo del encargado
  getNombreEncargado(encargadoId: string): string {
    const encargado = this.encargados?.find(e => e.encargadoId === encargadoId);
    return encargado ? `${encargado.nombre} ${encargado.apellido}` : '';
  }

  // Obtener el teléfono del encargado
  getTelefonoEncargado(encargadoId: string): string {
    const encargado = this.encargados?.find(e => e.encargadoId === encargadoId);
    return encargado ? `${encargado.telefono}` : '';
  }
  // Obtener el Email del encargado
  getEmailEncargado(encargadoId: string): string {
    const encargado = this.encargados?.find(e => e.encargadoId === encargadoId);
    return encargado ? `${encargado.email}` : '';
  }

  //Obtener la direccion del encargado
  getDireccionEncargado(encargadoId: string): string{
    let encargado = this.encargados?.find(e => e.encargadoId === encargadoId);
    return encargado ? `${encargado.direccion}` : '';
  }

  // Obtener el rango de edad de la clase
  getEdadClase(edadId: string): string {
    const edades = this.edades?.find(e => e.edadId === edadId);
    return edades ? `${edades.rangoEdad}` : '';
  }

  // Formatear la fecha en el formato 'dd/MM/yyyy'
  formatDate(fecha: string): string {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy') || '';
  }

  // Formatear la fecha en el formato 'dd de MMMM del yyyy' (mes en español)
  formatDateEs(fecha: string): string {
    return this.datePipe.transform(fecha, 'dd \'de\' MMMM \'del\' yyyy') || '';
  }

  // Exportar la lista de alumnos a un archivo Excel
  exportToExcel(): void {
    if (this.alumnos && this.alumnos.length > 0) {
      // Crear un nuevo arreglo con los campos deseados
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');

      const dataToExport = this.alumnos.map(alumno => ({
        Nombre: alumno.nombre,
        Apellido: alumno.apellido,
        FechaNacimiento: this.formatDateEs(alumno.fechaNacimiento), // Formatear la fecha
        Direccion: this.getDireccionEncargado(alumno.encargadoId),
        Email: this.getEmailEncargado(alumno.encargadoId),
        Telefono: this.getTelefonoEncargado(alumno.encargadoId),
        Padre: this.getNombreEncargado(alumno.encargadoId),
        Clase: this.getEdadClase(alumno.edadId)
      }));

      // Crear la hoja de cálculo y guardarla como archivo Excel
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');
      XLSX.writeFile(wb, `alumnos_${formattedDate}.xlsx`);
    }
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    this.alumnos;
  }
  
}
