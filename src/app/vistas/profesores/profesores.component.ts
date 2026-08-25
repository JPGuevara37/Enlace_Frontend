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
  styleUrls: ['./profesores.component.css'],
})
export class ProfesoresComponent implements OnInit {
  profesores: IListaProfesores[] = [];

  filtroNombre = '';

  seleccionados = new Set<string>();

  detalle: IListaProfesores | null = null;
  editando: IListaProfesores | null = null;

  itemsPerPage = 10;
  currentPage = 1;
  maxSize = 50;
  totalItems = 0;

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private alertas: AlertasService,
  ) {}

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

  get profesoresFiltrados(): IListaProfesores[] {
    const q = this.quitarTildes(this.filtroNombre.trim().toLowerCase());
    return this.profesores.filter(p => {
      const nombre = this.quitarTildes(`${p.nombre} ${p.apellido}`.toLowerCase());
      return !q || nombre.includes(q);
    });
  }

  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
  }

  get todosSeleccionados(): boolean {
    return this.profesoresFiltrados.length > 0 && this.profesoresFiltrados.every(p => this.seleccionados.has(p.profesorId));
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
      this.profesoresFiltrados.forEach(p => this.seleccionados.delete(p.profesorId));
    } else {
      this.profesoresFiltrados.forEach(p => this.seleccionados.add(p.profesorId));
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
    if (!window.confirm(`¿Eliminar ${ids.length} profesor(es)?`)) {
      return;
    }
    let pendientes = ids.length;
    let errores = 0;
    ids.forEach(id => {
      this.api.deleteProfesor({ profesorId: id } as any).subscribe({
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
    this.cargarProfesores();
    if (errores) {
      this.alertas.showError(`No se pudieron eliminar ${errores} registro(s)`, 'Error');
    } else {
      this.alertas.showSuccess('Eliminado(s) correctamente', 'Hecho');
    }
  }

  verDetalle(profesor: IListaProfesores): void {
    this.detalle = profesor;
  }

  cerrarDetalle(): void {
    this.detalle = null;
  }

  editar(profesor: IListaProfesores): void {
    this.editando = { ...profesor, categoria: profesor.categoria || 'Profesor' };
  }

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.editando) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.editando!.avatar = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  cerrarEdicion(): void {
    this.editando = null;
  }

  guardarEdicion(): void {
    if (!this.editando) {
      return;
    }
    this.api.putProfesores(this.editando).subscribe({
      next: () => {
        this.alertas.showSuccess('Datos guardados', 'Hecho');
        this.editando = null;
        this.cargarProfesores();
      },
      error: () => this.alertas.showError('No se pudo guardar', 'Error'),
    });
  }

  borrarProfesor(profesor: IListaProfesores): void {
    if (!window.confirm(`¿Eliminar a ${profesor.nombre} ${profesor.apellido}?`)) {
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

  nuevoProfesor(): void {
    this.router.navigate(['nuevo-profesores']);
  }

  iniciales(profesor: IListaProfesores): string {
    const n = profesor.nombre?.[0]?.toUpperCase() ?? '';
    const a = profesor.apellido?.[0]?.toUpperCase() ?? '';
    return `${n}${a}` || '?';
  }

  pageChanged(event: any): void {
    this.currentPage = event;
  }
}
