import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Servicios/api/api.service';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { IContenidoPortal } from '../../modelos/contenido-portal.interfase';

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './metas.component.html',
  styleUrls: ['./metas.component.css'],
})
export class MetasComponent implements OnInit {
  metas: IContenidoPortal[] = [];
  nuevo = '';
  cargando = true;

  constructor(private api: ApiService, private alertas: AlertasService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.api.getContenidoPortal('meta').subscribe({
      next: d => {
        this.metas = d;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.alertas.showError('No se pudieron cargar las metas', 'Error');
      },
    });
  }

  agregar(): void {
    if (!this.nuevo.trim()) {
      return;
    }
    const item: IContenidoPortal = { seccion: 'meta', detalle: this.nuevo.trim(), orden: this.metas.length + 1 };
    this.api.crearContenido(item).subscribe({
      next: () => {
        this.nuevo = '';
        this.alertas.showSuccess('Meta agregada', 'Hecho');
        this.cargar();
      },
      error: () => this.alertas.showError('No se pudo agregar', 'Error'),
    });
  }

  quitar(m: IContenidoPortal): void {
    if (!m.contenidoId) {
      return;
    }
    if (!window.confirm('¿Eliminar esta meta?')) {
      return;
    }
    this.api.borrarContenido(m.contenidoId).subscribe({
      next: () => {
        this.alertas.showSuccess('Meta eliminada', 'Hecho');
        this.cargar();
      },
      error: () => this.alertas.showError('No se pudo eliminar', 'Error'),
    });
  }
}
