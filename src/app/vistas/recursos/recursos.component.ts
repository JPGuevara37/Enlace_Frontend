import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ApiService } from '../../Servicios/api/api.service';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { IListaRecursos } from '../../modelos/listarecursos.interfase';

interface Tarjeta {
  nombre: string;
  icono: string;
  color: string;
  descripcion: string;
  cantidad: number;
}

const CLASES: Omit<Tarjeta, 'cantidad'>[] = [
  { nombre: 'Legado', icono: 'fa-solid fa-people-roof', color: '#4e73df', descripcion: 'Recursos de la clase Legado' },
  { nombre: 'Aspirantes', icono: 'fa-solid fa-child-reaching', color: '#1cc88a', descripcion: 'Recursos de la clase Aspirantes' },
  { nombre: 'Retoñitos', icono: 'fa-solid fa-sprout', color: '#f6c23e', descripcion: 'Recursos de la clase Retoñitos' },
  { nombre: 'Pampanitos', icono: 'fa-solid fa-seedling', color: '#e74a3b', descripcion: 'Recursos de la clase Pampanitos' },
  { nombre: 'Semillitas', icono: 'fa-solid fa-leaf', color: '#36b9cc', descripcion: 'Recursos de la clase Semillitas' },
];

const COLORES_OTROS = ['#6f42c1', '#fd7e14', '#0e9aa7', '#d63384'];

@Component({
  selector: 'app-recursos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recursos.component.html',
  styleUrl: './recursos.component.css'
})
export class RecursosComponent implements OnInit {

  recursos: IListaRecursos[] = [];
  recursosFiltrados: IListaRecursos[] = [];
  filtroNombre: string = '';
  tarjetaSeleccionada: Tarjeta | null = null;
  cargando = true;
  errorCarga = false;

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef, private alertas: AlertasService) {}

  ngOnInit(): void {
    this.cargarRecursos();
  }

  cargarRecursos(): void {
    this.cargando = true;
    this.errorCarga = false;
    this.api.getAllRecursos(1).subscribe({
      next: data => {
        this.recursos = data;
        this.recursosFiltrados = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.errorCarga = true;
        this.cdr.detectChanges();
      },
    });
  }

  get tarjetas(): Tarjeta[] {
    const porCategoria = new Map<string, IListaRecursos[]>();
    this.recursos.forEach(r => {
      const c = (r.categoria || '').trim() || 'Sin categoría';
      if (!porCategoria.has(c)) {
        porCategoria.set(c, []);
      }
      porCategoria.get(c)!.push(r);
    });

    const tarjetas: Tarjeta[] = CLASES.map(clase => ({
      ...clase,
      cantidad: porCategoria.get(clase.nombre)?.length ?? 0,
    }));

    Array.from(porCategoria.keys())
      .filter(c => !CLASES.some(cl => cl.nombre === c))
      .sort()
      .forEach((c, i) => {
        tarjetas.push({
          nombre: c,
          icono: 'fa-solid fa-folder',
          color: COLORES_OTROS[i % COLORES_OTROS.length],
          descripcion: 'Recursos variados',
          cantidad: porCategoria.get(c)!.length,
        });
      });

    return tarjetas;
  }

  get recursosCategoria(): IListaRecursos[] {
    if (!this.tarjetaSeleccionada) {
      return [];
    }
    return this.recursosFiltrados.filter(r => (r.categoria || '').trim() === this.tarjetaSeleccionada!.nombre);
  }

  get totalCategoria(): number {
    if (!this.tarjetaSeleccionada) {
      return 0;
    }
    return this.recursos.filter(r => (r.categoria || '').trim() === this.tarjetaSeleccionada!.nombre).length;
  }

  seleccionarTarjeta(tarjeta: Tarjeta): void {
    this.tarjetaSeleccionada = tarjeta;
    this.filtroNombre = '';
  }

  volver(): void {
    this.tarjetaSeleccionada = null;
    this.filtroNombre = '';
  }

  borrarRecurso(recurso: IListaRecursos): void {
    if (!window.confirm('¿Eliminar este recurso?')) {
      return;
    }
    this.api.deleteRecurso(recurso as any).subscribe({
      next: () => {
        this.alertas.showSuccess('Recurso eliminado', 'Hecho');
        this.cargarRecursos();
      },
      error: () => this.alertas.showError('No se pudo eliminar', 'Error'),
    });
  }

  editarRecursos(id: any) {
    this.router.navigate(['editar-recursos', id]);
  }

  nuevoRecurso() {
    this.router.navigate(['nuevo-recursos']);
  }

  filtrar() {
    const filtroSinTildes = this.quitarTildes(this.filtroNombre.toLowerCase());
    this.recursosFiltrados = this.recursos.filter(recurso =>
      this.quitarTildes((recurso.articulo || '').toLowerCase()).includes(filtroSinTildes)
    );
  }

  exportToExcel(): void {
    if (this.recursos && this.recursos.length > 0) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');

      const dataToExport = this.recursos.map(recurso => ({
        Clase: recurso.categoria || 'Sin categoría',
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

  salir() {
    this.router.navigate(['dashboard']);
  }
}
