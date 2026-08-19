import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaAlumnos } from '../../modelos/listaalumnos.interfase';
import { IListaEdades } from '../../modelos/listaedades.interfase';
import { IListaRecursos } from '../../modelos/listarecursos.interfase';

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

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    forkJoin({
      encargados: this.api.getAllEncargados(1).pipe(catchError(() => of([]))),
      alumnos: this.api.getAllAlumnos(1).pipe(catchError(() => of([]))),
      profesores: this.api.getAllProfesores(1).pipe(catchError(() => of([]))),
      recursos: this.api.getAllRecursos(1).pipe(catchError(() => of([]))),
      edades: this.api.getAllEdades(1).pipe(catchError(() => of([]))),
    }).subscribe({
      next: (r) => {
        this.totalEncargados = r.encargados.length;
        this.totalAlumnos = r.alumnos.length;
        this.totalProfesores = r.profesores.length;
        this.totalRecursos = r.recursos.length;
        this.buildAlumnosPorEdad(r.alumnos, r.edades);
        this.buildRecursosDonut(r.recursos);
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

  barPercent(value: number): number {
    return Math.round((value / this.maxAlumnosPorEdad) * 100);
  }
}
