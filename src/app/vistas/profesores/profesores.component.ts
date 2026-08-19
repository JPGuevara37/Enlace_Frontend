import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApiService } from '../../Servicios/api/api.service';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
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

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef, private alertas: AlertasService) {}

  ngOnInit(): void {
    this.cargarProfesores();
  }

  cargarProfesores(): void {
    this.api.getAllProfesores(1).subscribe(data => {
      this.profesores = data;
      this.totalItems = data.length;
      this.cdr.detectChanges();
    });
  }

  borrarProfesor(profesor: IListaProfesores): void {
    if (!window.confirm('¿Eliminar este profesor?')) {
      return;
    }
    this.api.deleteProfesor(profesor as any).subscribe({
      next: () => {
        this.alertas.showSuccess('Profesor eliminado', 'Hecho');
        this.cargarProfesores();
      },
      error: () => this.alertas.showError('No se pudo eliminar', 'Error'),
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

  guardarProfesor(profesor: IListaProfesores) {
    this.api.putProfesores(profesor).subscribe({
      next: () => this.alertas.showSuccess('Datos guardados', 'Hecho'),
      error: () => this.alertas.showError('No se pudo guardar', 'Error'),
    });
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
