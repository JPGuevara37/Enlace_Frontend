import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaAlumnos } from '../../modelos/listaalumnos.interfase';
import { IListaEdades } from '../../modelos/listaedades.interfase';
import { IListaRecursos } from '../../modelos/listarecursos.interfase';
import { IListaProfesores } from '../../modelos/listaprofesores.interfase';
import { IRolesMes } from '../../modelos/rolesmes.interfase';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalEncargados = 0;
  totalAlumnos = 0;
  totalProfesores = 0;
  totalRecursos = 0;

  alumnosPorEdad: { label: string; value: number }[] = [];
  maxAlumnosPorEdad = 0;

  recursosActivos = 0;
  recursosInactivos = 0;
  donutActivoDash = '0 327';
  donutInactivoDash = '0 327';
  donutInactivoOffset = '0';

  cargando = true;

  mesActual = new Date().getMonth() + 1;
  annoActual = new Date().getFullYear();
  meses = MESES;

  profesoresList: IListaProfesores[] = [];
  edadesList: IListaEdades[] = [];
  domingos: { dia: number; fecha: Date; clases: { rangoEdad: string; personas: { nombre: string; esAsistente: boolean }[] }[] }[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    forkJoin({
      encargados: this.api.getAllEncargados(1).pipe(catchError(() => of([]))),
      alumnos: this.api.getAllAlumnos(1).pipe(catchError(() => of([]))),
      profesores: this.api.getAllProfesores(1).pipe(catchError(() => of([]))),
      recursos: this.api.getAllRecursos(1).pipe(catchError(() => of([]))),
      edades: this.api.getAllEdades(1).pipe(catchError(() => of([]))),
      rolesMes: this.api.getRolesMes(this.mesActual, this.annoActual).pipe(catchError(() => of([]))),
    }).subscribe({
      next: (r) => {
        this.totalEncargados = r.encargados.length;
        this.totalAlumnos = r.alumnos.length;
        this.totalProfesores = r.profesores.length;
        this.totalRecursos = r.recursos.length;
        this.profesoresList = r.profesores;
        this.edadesList = r.edades;
        this.buildAlumnosPorEdad(r.alumnos, r.edades);
        this.buildRecursosDonut(r.recursos);
        this.construirDomingos(r.rolesMes);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

  private buildAlumnosPorEdad(alumnos: IListaAlumnos[], edades: IListaEdades[]): void {
    const mapa = new Map<string, string>();
    edades.forEach((e) => mapa.set(e.edadId, e.rangoEdad));

    const conteo = new Map<string, number>();
    alumnos.forEach((a) => {
      const label = mapa.get(a.edadId) ?? 'Sin edad';
      conteo.set(label, (conteo.get(label) ?? 0) + 1);
    });

    this.alumnosPorEdad = Array.from(conteo.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
    this.maxAlumnosPorEdad = Math.max(1, ...this.alumnosPorEdad.map((i) => i.value));
  }

  private buildRecursosDonut(recursos: IListaRecursos[]): void {
    this.recursosActivos = recursos.filter((r) => r.activo).length;
    this.recursosInactivos = recursos.filter((r) => !r.activo).length;

    const total = this.totalRecursos > 0 ? this.totalRecursos : 1;
    const circunferencia = 2 * Math.PI * 52;
    const fraccionActivo = this.recursosActivos / total;
    const largoActivo = fraccionActivo * circunferencia;

    this.donutActivoDash = `${largoActivo} ${circunferencia}`;
    this.donutInactivoDash = `${circunferencia - largoActivo} ${circunferencia}`;
    this.donutInactivoOffset = `${-largoActivo}`;
  }

  private construirDomingos(rolesMes: IRolesMes[]): void {
    const domingos = this.obtenerDomingos(this.mesActual, this.annoActual);
    this.domingos = domingos
      .map(dia => {
        const asignaciones = rolesMes.filter(r => Number(r.dia) === dia);
        const clases = this.edadesList
          .map(edad => {
            const personas = asignaciones
              .filter(a => a.edadId === edad.edadId)
              .map(a => {
                const p = this.profesoresList.find(pp => pp.profesorId === a.personaId);
                return {
                  nombre: p ? `${p.nombre} ${p.apellido}` : '—',
                  esAsistente: (p?.categoria || 'Profesor') === 'Asistente',
                };
              });
            return { rangoEdad: edad.rangoEdad, personas };
          })
          .filter(c => c.personas.length > 0);
        return { dia, fecha: new Date(this.annoActual, this.mesActual - 1, dia), clases };
      })
      .filter(d => d.clases.length > 0);
  }

  private obtenerDomingos(mes: number, anno: number): number[] {
    const domingos: number[] = [];
    const diasEnMes = new Date(anno, mes, 0).getDate();
    for (let d = 1; d <= diasEnMes; d++) {
      if (new Date(anno, mes - 1, d).getDay() === 0) {
        domingos.push(d);
      }
    }
    return domingos;
  }

  nombreMes(mes: number): string {
    return this.meses[mes - 1] || `Mes ${mes}`;
  }

  nombreDia(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', { weekday: 'long' });
  }

  barPercent(value: number): number {
    return Math.round((value / this.maxAlumnosPorEdad) * 100);
  }
}
