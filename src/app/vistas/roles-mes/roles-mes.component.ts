import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaProfesores } from '../../modelos/listaprofesores.interfase';
import { IListaEdades } from '../../modelos/listaedades.interfase';
import { IRolesMes } from '../../modelos/rolesmes.interfase';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
  selector: 'app-roles-mes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './roles-mes.component.html',
  styleUrls: ['./roles-mes.component.css'],
})
export class RolesMesComponent implements OnInit {
  meses = MESES;

  personas: IListaProfesores[] = [];
  edades: IListaEdades[] = [];
  asignaciones: IRolesMes[] = [];

  mes = new Date().getMonth() + 1;
  anno = new Date().getFullYear();
  dia = 1;
  modoPropuesta = true;

  personaArrastrada: IListaProfesores | null = null;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.api.getAllProfesores(1).subscribe(data => {
      this.personas = data;
      this.cdr.detectChanges();
    });
    this.api.getAllEdades(1).subscribe(data => {
      this.edades = data;
      this.cdr.detectChanges();
    });
    this.cargarAsignaciones();
  }

  cargarAsignaciones(): void {
    this.api.getRolesMes(this.mes, this.anno).subscribe(data => {
      this.asignaciones = data;
      this.cdr.detectChanges();
    });
  }

  cambiarPeriodo(): void {
    this.cargarAsignaciones();
  }

  onDragStart(persona: IListaProfesores): void {
    this.personaArrastrada = persona;
  }

  onDragEnd(): void {
    this.personaArrastrada = null;
  }

  onDrop(edad: IListaEdades): void {
    if (!this.personaArrastrada) {
      return;
    }
    const persona = this.personaArrastrada;
    const existente = this.asignaciones.find(a => a.edadId === edad.edadId);

    if (existente && existente.rolMesId) {
      existente.personaId = persona.profesorId;
      this.api.actualizarRolMes(existente).subscribe({
        next: () => this.cargarAsignaciones(),
        error: () => {},
      });
    } else {
      const nuevo: IRolesMes = {
        edadId: edad.edadId,
        personaId: persona.profesorId,
        mes: this.mes,
        anno: this.anno,
        dia: this.dia,
        estado: this.modoPropuesta ? 'Propuesta' : 'Confirmado',
        disponible: true,
      };
      this.api.crearRolMes(nuevo).subscribe({
        next: () => this.cargarAsignaciones(),
        error: () => {},
      });
    }
    this.personaArrastrada = null;
  }

  getAsignacion(edadId: string): IRolesMes | undefined {
    return this.asignaciones.find(a => a.edadId === edadId && a.dia === this.dia);
  }

  getPersona(personaId: string): IListaProfesores | undefined {
    return this.personas.find(p => p.profesorId === personaId);
  }

  quitar(rol: IRolesMes): void {
    if (!rol.rolMesId) {
      return;
    }
    this.api.borrarRolMes(rol.rolMesId).subscribe({
      next: () => this.cargarAsignaciones(),
      error: () => {},
    });
  }

  alternarEstado(rol: IRolesMes): void {
    rol.estado = rol.estado === 'Confirmado' ? 'Propuesta' : 'Confirmado';
    this.api.actualizarRolMes(rol).subscribe({
      error: () => {},
    });
  }

  nombreMes(mes: number): string {
    return this.meses[mes - 1] || `Mes ${mes}`;
  }
}
