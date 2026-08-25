import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Servicios/api/api.service';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { IContenidoPortal } from '../../modelos/contenido-portal.interfase';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css'],
})
export class ActividadesComponent implements OnInit {
  actividades: IContenidoPortal[] = [];
  iconos = ['fa-sun', 'fa-children', 'fa-gift', 'fa-star', 'fa-heart', 'fa-music', 'fa-calendar-star', 'fa-cake-candles', 'fa-flag', 'fa-camera'];

  form = { titulo: '', detalle: '', icono: 'fa-calendar-star' };
  cargando = true;

  constructor(private api: ApiService, private alertas: AlertasService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.api.getContenidoPortal('actividad').subscribe({
      next: d => {
        this.actividades = d;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.alertas.showError('No se pudieron cargar las actividades', 'Error');
      },
    });
  }

  agregar(): void {
    if (!this.form.titulo.trim()) {
      return;
    }
    const item: IContenidoPortal = {
      seccion: 'actividad',
      titulo: this.form.titulo.trim(),
      detalle: this.form.detalle.trim(),
      icono: this.form.icono,
      orden: this.actividades.length + 1,
    };
    this.api.crearContenido(item).subscribe({
      next: () => {
        this.form = { titulo: '', detalle: '', icono: 'fa-calendar-star' };
        this.alertas.showSuccess('Actividad agregada', 'Hecho');
        this.cargar();
      },
      error: () => this.alertas.showError('No se pudo agregar', 'Error'),
    });
  }

  quitar(a: IContenidoPortal): void {
    if (!a.contenidoId) {
      return;
    }
    if (!window.confirm('¿Eliminar esta actividad?')) {
      return;
    }
    this.api.borrarContenido(a.contenidoId).subscribe({
      next: () => {
        this.alertas.showSuccess('Actividad eliminada', 'Hecho');
        this.cargar();
      },
      error: () => this.alertas.showError('No se pudo eliminar', 'Error'),
    });
  }
}
