import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../Servicios/api/api.service';
import { IRolesMes } from '../../modelos/rolesmes.interfase';
import { IListaEdades } from '../../modelos/listaedades.interfase';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

interface HomeModule {
  ruta: string;
  icono: string;
  titulo: string;
  descripcion: string;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  modulos: HomeModule[] = [
    { ruta: '/encargados', icono: 'fa-user-group', titulo: 'Padres', descripcion: 'Gestiona los encargados de familia', color: '#005a65' },
    { ruta: '/alumnos', icono: 'fa-children', titulo: 'Alumnos', descripcion: 'Administra los estudiantes del ministerio', color: '#1cc88a' },
    { ruta: '/profesores', icono: 'fa-chalkboard-user', titulo: 'Profesores', descripcion: 'Controla el equipo de maestros', color: '#f6c23e' },
    { ruta: '/recursos', icono: 'fa-box-archive', titulo: 'Recursos', descripcion: 'Inventario de materiales y recursos', color: '#e74a3b' },
    { ruta: '/material', icono: 'fa-folder-open', titulo: 'Material', descripcion: 'Documentos y material de apoyo', color: '#36b9cc' },
  ];

  esGestor = false;

  misRoles: IRolesMes[] = [];
  edades: IListaEdades[] = [];
  mesesConRoles: number[] = [];
  mesFiltro = 0;
  cargando = true;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {
    this.esGestor = ['administrador', 'lidere'].includes(api.getRole());
    if (this.api.isAdmin()) {
      this.modulos.push({
        ruta: '/configuracion',
        icono: 'fa-gear',
        titulo: 'Configuración',
        descripcion: 'Gestión de usuarios y roles',
        color: '#5a6b8c',
      });
    }
  }

  ngOnInit(): void {
    if (!this.esGestor) {
      this.cargarMisRoles();
    }
  }

  cargarMisRoles(): void {
    this.cargando = true;
    this.api.getAllEdades(1).subscribe(e => {
      this.edades = e;
    });
    this.api.getMisRolesMes().subscribe({
      next: roles => {
        this.misRoles = roles;
        this.mesesConRoles = Array.from(new Set(roles.map(r => Number(r.mes)))).sort((a, b) => a - b);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  get rolesFiltrados(): IRolesMes[] {
    if (!this.mesFiltro) {
      return this.misRoles;
    }
    return this.misRoles.filter(r => Number(r.mes) === this.mesFiltro);
  }

  nombreMes(mes: number): string {
    return MESES[mes - 1] || `Mes ${mes}`;
  }

  nombreEdad(edadId: string): string {
    return this.edades.find(e => e.edadId === edadId)?.rangoEdad || 'Clase';
  }

  formatearFecha(rol: IRolesMes): string {
    const f = new Date(rol.anno, rol.mes - 1, rol.dia);
    return f.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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
}
