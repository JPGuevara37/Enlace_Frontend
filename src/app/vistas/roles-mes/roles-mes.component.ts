import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaProfesores } from '../../modelos/listaprofesores.interfase';
import { IListaEdades } from '../../modelos/listaedades.interfase';
import { IRolesMes } from '../../modelos/rolesmes.interfase';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

interface SlotClase {
  key: string;
  titulo: string;
  esCena: boolean;
  asignaciones: IRolesMes[];
}

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

  cenaSenorDia: number | null = null;
  cenaSenorSel = '';

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

  nombreClase(rol: IRolesMes): string {
    if (rol.tipo === 'CenaSenor') {
      return 'Cena del Señor';
    }
    return this.nombreEdad(rol.edadId ?? '');
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
    this.cargarCenaSenor();
  }

  cargarCenaSenor(): void {
    this.api.getCenaSenor(this.mes, this.anno).subscribe({
      next: data => {
        this.cenaSenorDia = data?.dia ?? null;
        this.cenaSenorSel = this.cenaSenorDia != null ? String(this.cenaSenorDia) : '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.cenaSenorDia = null;
        this.cenaSenorSel = '';
      },
    });
  }

  guardarCenaSenor(): void {
    const dia = this.cenaSenorSel === '' ? null : Number(this.cenaSenorSel);
    if (dia == null || isNaN(dia)) {
      this.api.borrarCenaSenor(this.mes, this.anno).subscribe({
        next: () => {
          this.cenaSenorDia = null;
          this.cdr.detectChanges();
        },
        error: () => {},
      });
      return;
    }
    this.api.upsertCenaSenor({ mes: this.mes, anno: this.anno, dia }).subscribe({
      next: () => {
        this.cenaSenorDia = dia;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
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
    this.cargarCenaSenor();
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

  onDrop(event: DragEvent, slot: SlotClase): void {
    event.preventDefault();
    if (this.personaArrastrada) {
      this.asignarASlot(this.personaArrastrada, slot);
      this.personaArrastrada = null;
    }
  }

  // Click to assign (alternativa confiable)
  seleccionarPersona(persona: IListaProfesores): void {
    if (this.personaSeleccionada?.profesorId === persona.profesorId) {
      this.personaSeleccionada = null;
    } else {
      this.personaSeleccionada = persona;
      this.scrollAClases();
    }
  }

  private scrollAClases(): void {
    setTimeout(() => {
      document.querySelector('.roles-mes .clases')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }

  asignarAClick(slot: SlotClase): void {
    if (!this.personaSeleccionada) {
      return;
    }
    this.asignarASlot(this.personaSeleccionada, slot);
    this.personaSeleccionada = null;
  }

  asignarASlot(persona: IListaProfesores, slot: SlotClase): void {
    if (slot.esCena) {
      this.asignar(persona, null, 'CenaSenor');
    } else {
      this.asignar(persona, slot.key, 'Clase');
    }
  }

  private asignar(persona: IListaProfesores, edadId: string | null, tipo: string): void {
    const asignadas = this.asignaciones.filter(a =>
      this.mismoSlot(a, edadId, tipo) && Number(a.dia) === Number(this.dia)
    );

    if (asignadas.some(a => a.personaId === persona.profesorId)) {
      return;
    }

    const esProfesor = (persona.categoria || 'Profesor') !== 'Asistente';

    if (esProfesor) {
      const profes = asignadas.filter(a => (this.getPersona(a.personaId)?.categoria || 'Profesor') !== 'Asistente').length;
      if (profes >= 2) {
        window.alert('Máximo 2 profesores por actividad');
        return;
      }
    } else {
      const asistentes = asignadas.filter(a => (this.getPersona(a.personaId)?.categoria || 'Profesor') === 'Asistente').length;
      if (asistentes >= 1) {
        window.alert('Máximo 1 asistente por actividad');
        return;
      }
    }

    const prev = this.obtenerDomingoAdjacente(this.dia, this.mes, this.anno, -7);
    const next = this.obtenerDomingoAdjacente(this.dia, this.mes, this.anno, 7);

    const repetido = this.asignaciones.some(a =>
      a.personaId === persona.profesorId &&
      this.mismoSlot(a, edadId, tipo) &&
      ((a.mes === prev.mes && a.anno === prev.anno && Number(a.dia) === prev.dia) ||
       (a.mes === next.mes && a.anno === next.anno && Number(a.dia) === next.dia))
    );

    if (repetido) {
      const confirmar = window.confirm('Este profesor ya tiene esta actividad en un domingo consecutivo. ¿Asignarlo de todos modos?');
      if (!confirmar) {
        return;
      }
    }

    const nuevo: IRolesMes = {
      edadId: edadId,
      personaId: persona.profesorId,
      mes: this.mes,
      anno: this.anno,
      dia: this.dia,
      tipo: tipo,
      estado: this.modoPropuesta ? 'Propuesta' : 'Confirmado',
      disponible: true,
    };
    this.api.crearRolMes(nuevo).subscribe({
      next: () => this.cargarAsignaciones(),
      error: () => {},
    });
  }

  private mismoSlot(a: IRolesMes, edadId: string | null, tipo: string): boolean {
    return tipo === 'CenaSenor'
      ? a.tipo === 'CenaSenor'
      : (a.tipo !== 'CenaSenor' && a.edadId === edadId);
  }

  esDomingoCenaSenor(): boolean {
    return this.cenaSenorDia != null && Number(this.cenaSenorDia) === Number(this.dia);
  }

  get slots(): SlotClase[] {
    const lista: SlotClase[] = this.edades.map(e => ({
      key: e.edadId,
      titulo: e.rangoEdad,
      esCena: false,
      asignaciones: this.getAsignaciones(e.edadId),
    }));
    if (this.esDomingoCenaSenor()) {
      lista.unshift({
        key: 'cena',
        titulo: 'Cena del Señor',
        esCena: true,
        asignaciones: this.getAsignacionesCena(),
      });
    }
    return lista;
  }

  getAsignaciones(edadId: string): IRolesMes[] {
    return this.asignaciones.filter(a => a.edadId === edadId && a.tipo !== 'CenaSenor' && Number(a.dia) === Number(this.dia));
  }

  getAsignacionesCena(): IRolesMes[] {
    return this.asignaciones.filter(a => a.tipo === 'CenaSenor' && Number(a.dia) === Number(this.dia));
  }

  esAsistente(rol: IRolesMes): boolean {
    const p = this.getPersona(rol.personaId);
    return (p?.categoria || 'Profesor') === 'Asistente';
  }

  getPersona(personaId: string): IListaProfesores | undefined {
    return this.personas.find(p => p.profesorId === personaId);
  }

  iniciales(personaId: string): string {
    const p = this.getPersona(personaId);
    return `${p?.nombre?.[0] || ''}${p?.apellido?.[0] || ''}`;
  }

  get profesores(): IListaProfesores[] {
    return this.personas.filter(p => (p.categoria || '') !== 'Asistente');
  }

  get asistentes(): IListaProfesores[] {
    return this.personas.filter(p => (p.categoria || '') === 'Asistente');
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
