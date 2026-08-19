import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaProfesores } from '../../modelos/listaprofesores.interfase';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [FormsModule, NgxPaginationModule],
  templateUrl: './profesores.component.html',
  styleUrl: './profesores.component.css'
})
export class ProfesoresComponent implements OnInit {

  profesores: IListaProfesores[] = [];
  filtroNombre: string = '';
  itemsPerPage: number = 5;
  currentPage: number = 1;
  maxSize: number = 50;
  totalItems: number = 0;

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.api.getAllProfesores(1).subscribe(data => {
      this.profesores = data;
      this.cdr.detectChanges();
    });
  }

  encargadosPage() {
    this.router.navigate(['/encargados']);
  }

  alumnosPage() {
    this.router.navigate(['/alumnos']);
  }

  profesoresPage() {
    this.router.navigate(['/profesores']);
  }

  recursosPage() {
    this.router.navigate(['/recursos']);
  }

  editarProfesores(id: any) {
    this.router.navigate(['editar-profesores', id]);
  }

  nuevoProfesores() {
    this.router.navigate(['nuevo-profesores']);
  }

  filtrar() {
    this.api.getAllProfesores(1).subscribe(data => {
      const filtroSinTildes = this.quitarTildes(this.filtroNombre.toLowerCase());

      this.profesores = data.filter(profesor =>
        this.quitarTildes(profesor.nombre.toLowerCase()).includes(filtroSinTildes) ||
        this.quitarTildes(profesor.apellido.toLowerCase()).includes(filtroSinTildes)
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
}
