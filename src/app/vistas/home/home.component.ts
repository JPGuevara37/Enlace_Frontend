import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaProfesores } from '../../modelos/listaprofesores.interfase';
import { IListaEdades } from '../../modelos/listaedades.interfase';
import { IRolesMes } from '../../modelos/rolesmes.interfase';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  meses = MESES;
  mes = new Date().getMonth() + 1;
  anno = new Date().getFullYear();
  cargando = true;

  profesoresList: IListaProfesores[] = [];
  edadesList: IListaEdades[] = [];
  domingos: { dia: number; fecha: Date; clases: { rangoEdad: string; personas: { nombre: string; esAsistente: boolean }[] }[] }[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    forkJoin({
      profesores: this.api.getAllProfesores(1).pipe(catchError(() => of([]))),
      edades: this.api.getAllEdades(1).pipe(catchError(() => of([]))),
    }).subscribe(r => {
      this.profesoresList = r.profesores;
      this.edadesList = r.edades;
      this.cargarRoles();
    });
  }

  cargarRoles(): void {
    this.cargando = true;
    this.api.getRolesMes(this.mes, this.anno).pipe(catchError(() => of([]))).subscribe({
      next: roles => {
        this.construirDomingos(roles);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  cambiarPeriodo(): void {
    this.cargarRoles();
  }

  private construirDomingos(rolesMes: IRolesMes[]): void {
    const domingos = this.obtenerDomingos(this.mes, this.anno);
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
        return { dia, fecha: new Date(this.anno, this.mes - 1, dia), clases };
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
}
