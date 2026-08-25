import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
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

  profesoresAbierto = true;
  asistentesAbierto = true;

  esGestor = false;
  misAsignaciones: IRolesMes[] = [];

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.esGestor = ['administrador', 'lidere'].includes(this.api.getRole());
    if (this.esGestor) {
      this.calcularDomingos();
      this.cargarDatos();
    } else {
      this.cargarMisAsignaciones();
    }
  }

  cargarMisAsignaciones(): void {
    this.api.getAllEdades(1).subscribe(data => {
      this.edades = data;
      this.cdr.detectChanges();
    });
    this.api.getMisRolesMes().subscribe({
      next: data => {
        this.misAsignaciones = data;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  nombreEdad(edadId: string): string {
    return this.edades.find(e => e.edadId === edadId)?.rangoEdad || 'Clase';
  }

  formatearFechaRol(rol: IRolesMes): string {
    const fecha = new Date(rol.anno, rol.mes - 1, rol.dia);
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  responder(rol: IRolesMes, respuesta: string): void {
    if (!rol.rolMesId) {
      return;
    }
    this.api.responderRolMes(rol.rolMesId, respuesta).subscribe({
      next: () => {
        rol.respuesta = respuesta;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
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
    const prevMes = this.mes === 1 ? 12 : this.mes - 1;
    const prevAnno = this.mes === 1 ? this.anno - 1 : this.anno;
    forkJoin([
      this.api.getRolesMes(this.mes, this.anno),
      this.api.getRolesMes(prevMes, prevAnno),
    ]).subscribe(([actual, previo]) => {
      this.asignaciones = [...actual, ...previo];
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

  obtenerDomingoAdjacente(dia: number, mes: number, anno: number, offsetDias: number): { dia: number; mes: number; anno: number } {
    const fecha = new Date(anno, mes - 1, dia);
    fecha.setDate(fecha.getDate() + offsetDias);
    return { dia: fecha.getDate(), mes: fecha.getMonth() + 1, anno: fecha.getFullYear() };
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
    const asignadas = this.getAsignaciones(edad.edadId);

    if (asignadas.some(a => a.personaId === persona.profesorId)) {
      return;
    }

    const esProfesor = (persona.categoria || 'Profesor') !== 'Equipo de apoyo';

    if (esProfesor) {
      const profes = asignadas.filter(a => (this.getPersona(a.personaId)?.categoria || 'Profesor') !== 'Equipo de apoyo').length;
      if (profes >= 2) {
        window.alert('Máximo 2 profesores por clase');
        return;
      }
    } else {
      const asistentes = asignadas.filter(a => (this.getPersona(a.personaId)?.categoria || 'Profesor') === 'Equipo de apoyo').length;
      if (asistentes >= 1) {
        window.alert('Máximo 1 asistente por clase');
        return;
      }
    }

    const prev = this.obtenerDomingoAdjacente(this.dia, this.mes, this.anno, -7);
    const next = this.obtenerDomingoAdjacente(this.dia, this.mes, this.anno, 7);

    const repetido = this.asignaciones.some(a =>
      a.personaId === persona.profesorId &&
      a.edadId === edad.edadId &&
      ((a.mes === prev.mes && a.anno === prev.anno && Number(a.dia) === prev.dia) ||
       (a.mes === next.mes && a.anno === next.anno && Number(a.dia) === next.dia))
    );

    if (repetido) {
      const confirmar = window.confirm('Este profesor ya tiene esta clase en un domingo consecutivo. ¿Asignarlo de todos modos?');
      if (!confirmar) {
        return;
      }
    }

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

  getAsignaciones(edadId: string): IRolesMes[] {
    return this.asignaciones.filter(a => a.edadId === edadId && Number(a.dia) === Number(this.dia));
  }

  esAsistente(rol: IRolesMes): boolean {
    const p = this.getPersona(rol.personaId);
    return (p?.categoria || 'Profesor') === 'Equipo de apoyo';
  }

  getPersona(personaId: string): IListaProfesores | undefined {
    return this.personas.find(p => p.profesorId === personaId);
  }

  get profesores(): IListaProfesores[] {
    return this.personas.filter(p => (p.categoria || '') !== 'Equipo de apoyo');
  }

  get asistentes(): IListaProfesores[] {
    return this.personas.filter(p => (p.categoria || '') === 'Equipo de apoyo');
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
