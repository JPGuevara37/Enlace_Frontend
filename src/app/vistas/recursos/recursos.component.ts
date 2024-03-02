import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Servicios/api/api.service';
import { Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';

import { IListaRecursos } from '../../modelos/listarecursos.interfase';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrl: './recursos.component.css'
})
export class RecursosComponent {

  recursos:IListaRecursos[] = [];
  filtroNombre: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  maxSize: number = 5; // Puedes ajustar el tamaño máximo de la paginación aquí
  totalItems: number = 0;
  disablePrevious: boolean | undefined;
  disableNext: boolean | undefined;
  totalPages: number | undefined;
  hidePageNumbers: boolean = true; 
  pageRange: 2 | undefined;

  constructor(private api:ApiService, private router:Router){}

  ngOnInit(): void{
    this.api.getAllRecursos(1).subscribe(data =>{
      this.recursos = data;
    })
  }

  editarRecursos(id: any){
    this.router.navigate(['editar-recursos', id])
  }

  nuevoRecurso(){
    this.router.navigate(['nuevo-recursos']);
  }

  filtrar() {
    // Filtra la lista de encargados por el nombre o apellido ingresado en el filtro
    this.api.getAllRecursos(1).subscribe(data => {
      const filtroSinTildes = this.quitarTildes(this.filtroNombre.toLowerCase());

      this.recursos = data.filter(encargado =>
        this.quitarTildes(encargado.articulo.toLowerCase()).includes(filtroSinTildes)
      );
    });
  }


  // Exportar la lista de alumnos a un archivo Excel
  exportToExcel(): void {
    if (this.recursos && this.recursos.length > 0) {
      // Crear un nuevo arreglo con los campos deseados
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');

      const dataToExport = this.recursos.map(recurso => ({
        Artículo: recurso.articulo,
        Cantidad: recurso.cantidad,
        Numero_Locker: recurso.numero_Locker,
        Descripción: recurso.descripcion,
      }));

      // Crear la hoja de cálculo y guardarla como archivo Excel
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');
      XLSX.writeFile(wb, `recursos_en_lockers${formattedDate}.xlsx`);
    }
  }


  quitarTildes(texto: string): string {
      return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // paginacion
  pageChanged(event: any): void {
    this.currentPage = event
    this.recursos;
    this.deshabilitarBotonesSegunPagina();
  }

  deshabilitarBotonesSegunPagina(): void {
    this.disablePrevious = this.currentPage === 1;
    this.disableNext = this.currentPage === this.totalPages;
    
  }

  salir(){
    this.router.navigate(['dashboard']);
  }

}
