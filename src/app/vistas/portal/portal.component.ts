import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaProfesores } from '../../modelos/listaprofesores.interfase';

interface Actividad {
  titulo: string;
  detalle: string;
  icono: string;
}

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [],
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css'],
})
export class PortalComponent implements OnInit {
  lideres = [
    { nombre: 'José Pablo Guevara Brenes', rol: 'Líder de ministerio', iniciales: 'JG' },
    { nombre: 'Pri Araya', rol: 'Líder de ministerio', iniciales: 'PA' },
  ];

  metas = [
    'Continuar con el material propio, estudiando libros enteros de la Biblia.',
    'Capacitar al equipo de servidores para tratar niños con capacidades especiales y niños en riesgo, además de proveer más técnicas de enseñanza.',
    'Ofrecer discipulados a aquellos que quieran incorporarse al equipo para enseñar.',
    'Reunir 4 veces al año al equipo de trabajo completo para capacitación y evaluación.',
    'Realizar seguimientos individuales (1v1) a cada servidor.',
    'Realizar reunión de padres al menos una vez al año.',
    'Entrevistar a familias nuevas para actualizar la base de datos.',
  ];

  actividades: Actividad[] = [
    { titulo: 'Escuelita de vacaciones', detalle: '16 al 18 de julio, 2026', icono: 'fa-sun' },
    { titulo: 'Día del Niño (Evangelístico)', detalle: '13 de septiembre', icono: 'fa-children' },
    { titulo: 'Fiesta de Navidad', detalle: '13 de diciembre', icono: 'fa-gift' },
  ];

  maestros: IListaProfesores[] = [];
  apoyo: IListaProfesores[] = [];
  cargandoEquipo = true;

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAllProfesores(1).subscribe({
      next: data => {
        this.maestros = data.filter(p => (p.categoria || '') !== 'Equipo de apoyo');
        this.apoyo = data.filter(p => (p.categoria || '') === 'Equipo de apoyo');
        this.cargandoEquipo = false;
      },
      error: () => {
        this.cargandoEquipo = false;
      },
    });
  }

  ingresar(): void {
    this.router.navigate(['/login']);
  }

  iniciales(nombre: string, apellido: string): string {
    return `${nombre?.[0] ?? ''}${apellido?.[0] ?? ''}`.toUpperCase();
  }
}
