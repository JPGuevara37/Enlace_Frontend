import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaProfesores } from '../../modelos/listaprofesores.interfase';
import { IContenidoPortal } from '../../modelos/contenido-portal.interfase';
import { IListaEdades } from '../../modelos/listaedades.interfase';

const INFO_CLASES: Record<string, { icono: string; color: string }> = {
  Legado: { icono: 'fa-solid fa-people-roof', color: '#005a65' },
  Aspirantes: { icono: 'fa-solid fa-child-reaching', color: '#1cc88a' },
  Retoñitos: { icono: 'fa-solid fa-sprout', color: '#f6c23e' },
  Semillitas: { icono: 'fa-solid fa-leaf', color: '#36b9cc' },
};

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
  metas: IContenidoPortal[] = [];
  actividades: IContenidoPortal[] = [];
  clases: { nombre: string; icono: string; color: string }[] = [];

  profesores: IListaProfesores[] = [];
  cargandoEquipo = true;
  errorEquipo = false;

  constructor(private router: Router, private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarEquipo();
    this.cargarContenido();
    this.cargarClases();
  }

  cargarClases(): void {
    this.api.getAllEdades(1).subscribe({
      next: edades => {
        this.clases = edades.map(e => {
          const info = INFO_CLASES[e.rangoEdad] || { icono: 'fa-solid fa-children', color: '#36b9cc' };
          return { nombre: e.rangoEdad, icono: info.icono, color: info.color };
        });
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  cargarContenido(): void {
    this.api.getContenidoPortal('meta').subscribe({
      next: d => {
        this.metas = d;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
    this.api.getContenidoPortal('actividad').subscribe({
      next: d => {
        this.actividades = d;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
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
