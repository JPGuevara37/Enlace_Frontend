import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { ApiService } from '../../Servicios/api/api.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { IListaAlumnos } from '../../modelos/listaalumnos.interfase';
import { IListaEcargados } from '../../modelos/listaencargados.interfase';

import * as XLSX from 'xlsx';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { IListaEdades } from '../../modelos/listaedades.interfase';

registerLocaleData(localeEs);

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css'],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'es' }]
})

export class AlumnosComponent {


  alumnos:IListaAlumnos[] | undefined;
  encargados:IListaEcargados[] | undefined;
  edades: IListaEdades[] | undefined;
  filtroNombre: string = '';


  constructor(
    private api:ApiService, 
    private router:Router,
    private datePipe: DatePipe
    ){}

  ngOnInit(): void{
    this.api.getAllAlumnos(1).subscribe(data =>{
      console.log(data);
      this.alumnos = data;
    })
    
    this.api.getAllEncargados(1).subscribe(data => {
      this.encargados = data;
      console.log('Encargados:', this.encargados);
      
      // Lógica de filtrado después de obtener los encargados
      this.filtrarEncargados();
    });

    this.api.getAllEdades(1).subscribe(data => {
      this.edades = data;
    });
  }

  filtrarEncargados() {
    // Filtra la lista de encargados por el nombre o apellido ingresado en el filtro
    if (this.encargados && this.encargados.length > 0) {
      this.alumnos = this.alumnos?.map(alumno => ({
        ...alumno,
        nombreEncargado: this.getNombreEncargado(alumno.encargadoId)
      }));
    }
  }

  editarAlumnos(id: any){
    this.router.navigate(['editar-alumnos', id])
  }

  nuevoAlumnos(){
    this.router.navigate(['nuevo-alumnos']);
  }


  filtrar() {
    // Filtra la lista de encargados por el nombre o apellido ingresado en el filtro
    this.api.getAllAlumnos(1).subscribe(data => {
      const filtroSinTildes = this.quitarTildes(this.filtroNombre.toLowerCase());

      this.alumnos = data.filter(encargado =>
        this.quitarTildes(encargado.nombre.toLowerCase()).includes(filtroSinTildes) ||
        this.quitarTildes(encargado.apellido.toLowerCase()).includes(filtroSinTildes)
      );
    });
  }

  quitarTildes(texto: string): string {
      return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  salir(){
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

  getEdadClase(edadId: string): string {
    const edades = this.edades?.find(e => e.edadId === edadId);
    return edades ? `${edades.rangoEdad}` : '';
  }


  // Fotmatos de fecha a mostrar.
  formatDate(fecha: string): string {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy') || '';
  }
  
  formatDateEs(fecha: string): string {
    return this.datePipe.transform(fecha, 'dd \'de\' MMMM \'del\' yyyy') || '';
  }
  //Exportar a excel.
  exportToExcel(): void {
    if (this.alumnos && this.alumnos.length > 0) {
      // Crear un nuevo arreglo con los campos deseados
      const dataToExport = this.alumnos.map(alumno => ({
        Nombre: alumno.nombre,
        Apellido: alumno.apellido,
        FechaNacimiento: this.formatDate(alumno.fechaNacimiento), // Formatear la fecha
        Direccion: alumno.direccion,
        Email: alumno.email,
        Telefono: alumno.telefono,
        Padre: this.getNombreEncargado(alumno.encargadoId)
      }));
  
      // Crear la hoja de cálculo y guardarla como archivo Excel
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');
      XLSX.writeFile(wb, 'alumnos.xlsx');
    }
  }
  

}

