import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApiService } from '../../Servicios/api/api.service';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { IListaEcargados } from '../../modelos/listaencargados.interfase';
import { PROVINCIAS } from '../../modelos/ubicaciones';

@Component({
  selector: 'app-encargados',
  standalone: true,
  imports: [FormsModule, NgxPaginationModule],
  templateUrl: './encargados.component.html',
  styleUrls: ['./encargados.component.css'],
})
export class EncargadosComponent implements OnInit {
  encargados: IListaEcargados[] = [];
  provincias = PROVINCIAS;

  filtroNombre = '';
  filtroProvincia = '';
  filtroCanton = '';

  seleccionados = new Set<string>();

  detalle: IListaEcargados | null = null;
  editando: IListaEcargados | null = null;
  editProvincia = '';
  editCanton = '';
  editDistrito = '';

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
    this.cargarEncargados();
  }

  cargarEncargados(): void {
    this.api.getAllEncargados(1).subscribe(data => {
      this.encargados = data;
      this.totalItems = data.length;
      this.cdr.detectChanges();
    });
  }

  get encargadosFiltrados(): IListaEcargados[] {
    const q = this.quitarTildes(this.filtroNombre.trim().toLowerCase());
    return this.encargados.filter(e => {
      const nombre = this.quitarTildes(`${e.nombre} ${e.apellido}`.toLowerCase());
      const coincideNombre = !q || nombre.includes(q);
      const coincideProvincia = !this.filtroProvincia || e.provincia === this.filtroProvincia;
      const coincideCanton = !this.filtroCanton || e.canton === this.filtroCanton;
      return coincideNombre && coincideProvincia && coincideCanton;
    });
  }

  get cantonesFiltro() {
    const p = this.provincias.find(p => p.nombre === this.filtroProvincia);
    return p ? p.cantones : [];
  }

  get cantonesEdicion() {
    const p = this.provincias.find(p => p.nombre === this.editProvincia);
    return p ? p.cantones : [];
  }

  get distritosEdicion() {
    const c = this.cantonesEdicion.find(c => c.nombre === this.editCanton);
    return c ? c.distritos : [];
  }

  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroProvincia = '';
    this.filtroCanton = '';
  }

  // Selección múltiple
  get todosSeleccionados(): boolean {
    return this.encargadosFiltrados.length > 0 && this.encargadosFiltrados.every(e => this.seleccionados.has(e.encargadoId));
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
      this.encargadosFiltrados.forEach(e => this.seleccionados.delete(e.encargadoId));
    } else {
      this.encargadosFiltrados.forEach(e => this.seleccionados.add(e.encargadoId));
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
    if (!window.confirm(`¿Eliminar ${ids.length} encargado(s)?`)) {
      return;
    }
    let pendientes = ids.length;
    let errores = 0;
    ids.forEach(id => {
      this.api.deleteEncargado({ encargadoId: id } as any).subscribe({
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
    this.cargarEncargados();
    if (errores) {
      this.alertas.showError(`No se pudieron eliminar ${errores} registro(s)`, 'Error');
    } else {
      this.alertas.showSuccess('Eliminado(s) correctamente', 'Hecho');
    }
  }

  // Detalle
  verDetalle(encargado: IListaEcargados): void {
    this.detalle = encargado;
  }

  cerrarDetalle(): void {
    this.detalle = null;
  }

  // Edición
  editar(encargado: IListaEcargados): void {
    this.editando = { ...encargado };
    this.editProvincia = encargado.provincia || '';
    this.editCanton = encargado.canton || '';
    this.editDistrito = encargado.distrito || '';
  }

  cerrarEdicion(): void {
    this.editando = null;
  }

  onProvinciaEdicion(): void {
    this.editCanton = '';
    this.editDistrito = '';
  }

  onCantonEdicion(): void {
    this.editDistrito = '';
  }

  guardarEdicion(): void {
    if (!this.editando) {
      return;
    }
    this.editando.provincia = this.editProvincia;
    this.editando.canton = this.editCanton;
    this.editando.distrito = this.editDistrito;
    this.api.putEncargado(this.editando).subscribe({
      next: () => {
        this.alertas.showSuccess('Datos guardados', 'Hecho');
        this.editando = null;
        this.cargarEncargados();
      },
      error: () => this.alertas.showError('No se pudo guardar', 'Error'),
    });
  }

  borrarEncargado(encargado: IListaEcargados): void {
    if (!window.confirm(`¿Eliminar a ${encargado.nombre} ${encargado.apellido}?`)) {
      return;
    }
    this.api.deleteEncargado(encargado as any).subscribe({
      next: () => {
        this.alertas.showSuccess('Encargado eliminado', 'Hecho');
        this.cargarEncargados();
      },
      error: () => this.alertas.showError('No se pudo eliminar', 'Error'),
    });
  }

  nuevoEncargado(): void {
    this.router.navigate(['nuevo']);
  }

  iniciales(encargado: IListaEcargados): string {
    const n = encargado.nombre?.[0]?.toUpperCase() ?? '';
    const a = encargado.apellido?.[0]?.toUpperCase() ?? '';
    return `${n}${a}` || '?';
  }

  direccionCompleta(encargado: IListaEcargados): string {
    const partes = [encargado.distrito, encargado.canton, encargado.provincia, encargado.direccion].filter(Boolean);
    return partes.join(', ') || 'Sin dirección';
  }

  pageChanged(event: any): void {
    this.currentPage = event;
  }
}
