import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../Servicios/api/api.service';

interface HomeModule {
  ruta: string;
  icono: string;
  titulo: string;
  descripcion: string;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  modulos: HomeModule[] = [
    { ruta: '/encargados', icono: 'fa-user-group', titulo: 'Padres', descripcion: 'Gestiona los encargados de familia', color: '#005a65' },
    { ruta: '/alumnos', icono: 'fa-children', titulo: 'Alumnos', descripcion: 'Administra los estudiantes del ministerio', color: '#1cc88a' },
    { ruta: '/profesores', icono: 'fa-chalkboard-user', titulo: 'Profesores', descripcion: 'Controla el equipo de maestros', color: '#f6c23e' },
    { ruta: '/recursos', icono: 'fa-box-archive', titulo: 'Recursos', descripcion: 'Inventario de materiales y recursos', color: '#e74a3b' },
    { ruta: '/material', icono: 'fa-folder-open', titulo: 'Material', descripcion: 'Documentos y material de apoyo', color: '#36b9cc' },
  ];

  constructor(private api: ApiService) {
    if (this.api.isAdmin()) {
      this.modulos.push({
        ruta: '/configuracion',
        icono: 'fa-gear',
        titulo: 'Configuración',
        descripcion: 'Gestión de usuarios y roles',
        color: '#5a6b8c',
      });
    }
  }
}
