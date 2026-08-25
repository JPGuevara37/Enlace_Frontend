import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaProfesores } from '../../modelos/listaprofesores.interfase';

interface Actividad {
  titulo: string;
  detalle: string;
  icono: string;
}

interface Lider {
  nombre: string;
  rol: string;
  iniciales: string;
  avatar: string;
}

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [],
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css'],
})
export class PortalComponent implements OnInit {
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

  profesores: IListaProfesores[] = [];
  cargandoEquipo = true;
  errorEquipo = false;

  constructor(private router: Router, private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarEquipo();
  }

  cargarEquipo(): void {
    this.cargandoEquipo = true;
    this.errorEquipo = false;
    this.api.getAllProfesores(1).subscribe({
      next: data => {
        this.profesores = data;
        this.cargandoEquipo = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoEquipo = false;
        this.errorEquipo = true;
        this.cdr.detectChanges();
      },
    });
  }

  get lideres(): Lider[] {
    return this.profesores
      .filter(p => (p.categoria || '') === 'Líder')
      .map(p => ({
        nombre: `${p.nombre} ${p.apellido}`.trim(),
        rol: 'Líder de ministerio',
        iniciales: this.iniciales(p.nombre, p.apellido),
        avatar: p.avatar || '',
      }));
  }

  get maestros(): IListaProfesores[] {
    return this.profesores.filter(p => !['Líder', 'Asistente'].includes(p.categoria || ''));
  }

  get apoyo(): IListaProfesores[] {
    return this.profesores.filter(p => (p.categoria || '') === 'Asistente');
  }

  ingresar(): void {
    this.router.navigate(['/login']);
  }

  iniciales(nombre: string, apellido: string): string {
    return `${nombre?.[0] ?? ''}${apellido?.[0] ?? ''}`.toUpperCase();
  }
}
