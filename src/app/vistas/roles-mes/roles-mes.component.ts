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
  domingos: number[] = [];

  personaArrastrada: IListaProfesores | null = null;
  personaSeleccionada: IListaProfesores | null = null;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.calcularDomingos();
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
    this.calcularDomingos();
    this.cargarAsignaciones();
  }

  calcularDomingos(): void {
    this.domingos = this.obtenerDomingos(this.mes, this.anno);
    if (!this.domingos.includes(this.dia)) {
      this.dia = this.domingos[0] || 1;
    }
  }

  obtenerDomingos(mes: number, anno: number): number[] {
    const domingos: number[] = [];
    const diasEnMes = new Date(anno, mes, 0).getDate();
    for (let d = 1; d <= diasEnMes; d++) {
      if (new Date(anno, mes - 1, d).getDay() === 0) {
        domingos.push(d);
      }
    }
    return domingos;
  }

  formatearDomingo(dia: number): string {
    const fecha = new Date(this.anno, this.mes - 1, dia);
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Drag and drop
  onDragStart(event: DragEvent, persona: IListaProfesores): void {
    this.personaArrastrada = persona;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', persona.profesorId);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEnd(): void {
    this.personaArrastrada = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, edad: IListaEdades): void {
    event.preventDefault();
    if (this.personaArrastrada) {
      this.asignarPersona(this.personaArrastrada, edad);
      this.personaArrastrada = null;
    }
  }

  // Click to assign (alternativa confiable)
  seleccionarPersona(persona: IListaProfesores): void {
    if (this.personaSeleccionada?.profesorId === persona.profesorId) {
      this.personaSeleccionada = null;
    } else {
      this.personaSeleccionada = persona;
    }
  }

  asignarAClase(edad: IListaEdades): void {
    if (!this.personaSeleccionada) {
      return;
    }
    this.asignarPersona(this.personaSeleccionada, edad);
    this.personaSeleccionada = null;
  }

  asignarPersona(persona: IListaProfesores, edad: IListaEdades): void {
    const existente = this.asignaciones.find(a => a.edadId === edad.edadId && a.dia === this.dia);

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
  }

  getAsignacion(edadId: string): IRolesMes | undefined {
    return this.asignaciones.find(a => a.edadId === edadId && Number(a.dia) === Number(this.dia));
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
}
