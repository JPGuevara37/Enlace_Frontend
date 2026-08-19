import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaEcargados } from '../../modelos/listaencargados.interfase';

@Component({
  selector: 'app-encargados',
  standalone: true,
  imports: [FormsModule, NgxPaginationModule],
  templateUrl: './encargados.component.html',
  styleUrls: ['./encargados.component.css']
})
export class EncargadosComponent implements OnInit {

  encargados: IListaEcargados[] = [];
  filtroNombre: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  maxSize: number = 50;
  totalItems: number = 0;

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.api.getAllEncargados(1).subscribe(data => {
      this.encargados = data;
      this.cdr.detectChanges();
    });
  }

  editarEncargados(id: any) {
    this.router.navigate(['editar', id]);
  }

  nuevoEncargado() {
    this.router.navigate(['nuevo']);
  }

  filtrar() {
    this.api.getAllEncargados(1).subscribe(data => {
      const filtroSinTildes = this.quitarTildes(this.filtroNombre.toLowerCase());

      this.encargados = data.filter(encargado =>
        this.quitarTildes(encargado.nombre.toLowerCase()).includes(filtroSinTildes) ||
        this.quitarTildes(encargado.apellido.toLowerCase()).includes(filtroSinTildes)
      );
      this.cdr.detectChanges();
    });
  }

  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  pageChanged(event: any): void {
    this.currentPage = event;
  }

  salir() {
    this.router.navigate(['dashboard']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
