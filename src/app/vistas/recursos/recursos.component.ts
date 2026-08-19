import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import * as XLSX from 'xlsx';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaRecursos } from '../../modelos/listarecursos.interfase';
import { HeaderComponent } from '../../plantillas/header/header.component';
import { LoguotComponent } from '../../plantillas/loguot/loguot.component';
import { MenuComponent } from '../../plantillas/menu/menu.component';
import { FooterComponent } from '../../plantillas/footer/footer.component';

@Component({
  selector: 'app-recursos',
  standalone: true,
  imports: [FormsModule, NgxPaginationModule, HeaderComponent, LoguotComponent, MenuComponent, FooterComponent],
  templateUrl: './recursos.component.html',
  styleUrl: './recursos.component.css'
})
export class RecursosComponent implements OnInit {

  recursos: IListaRecursos[] = [];
  filtroNombre: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  maxSize: number = 5;
  totalItems: number = 0;
  disablePrevious: boolean | undefined;
  disableNext: boolean | undefined;
  totalPages: number | undefined;
  hidePageNumbers: boolean = true;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getAllRecursos(1).subscribe(data => {
      this.recursos = data;
    });
  }

  editarRecursos(id: any) {
    this.router.navigate(['editar-recursos', id]);
  }

  nuevoRecurso() {
    this.router.navigate(['nuevo-recursos']);
  }

  filtrar() {
    this.api.getAllRecursos(1).subscribe(data => {
      const filtroSinTildes = this.quitarTildes(this.filtroNombre.toLowerCase());

      this.recursos = data.filter(recurso =>
        this.quitarTildes(recurso.articulo.toLowerCase()).includes(filtroSinTildes)
      );
    });
  }

  exportToExcel(): void {
    if (this.recursos && this.recursos.length > 0) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');

      const dataToExport = this.recursos.map(recurso => ({
        Artículo: recurso.articulo,
        Cantidad: recurso.cantidad,
        Numero_Locker: recurso.numero_Locker,
        Descripción: recurso.descripcion,
      }));

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Recursos');
      XLSX.writeFile(wb, `recursos_en_lockers${formattedDate}.xlsx`);
    }
  }

  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    this.deshabilitarBotonesSegunPagina();
  }

  deshabilitarBotonesSegunPagina(): void {
    this.disablePrevious = this.currentPage === 1;
    this.disableNext = this.currentPage === this.totalPages;
  }

  salir() {
    this.router.navigate(['dashboard']);
  }
}
