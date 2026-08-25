import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Servicios/api/api.service';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { IUsuarios, IUsuarioGuardar } from '../../modelos/usuarios.interfase';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css'],
})
export class ConfiguracionComponent implements OnInit {
  roles = ['administrador', 'lidere', 'profes'];

  usuarios: IUsuarios[] = [];
  filtro = '';

  mostrarModal = false;
  modoEdicion = false;
  usuarioEditadoId: string | null = null;

  formulario: IUsuarioGuardar = this.formularioVacio();

  constructor(
    private api: ApiService,
    private alertas: AlertasService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  formularioVacio(): IUsuarioGuardar {
    return {
      nombre: '',
      apellido: '',
      usuario_Cuenta: '',
      password: '',
      email: '',
      role: 'profes',
      activo: true,
    };
  }

  cargarUsuarios(): void {
    this.api.getAllUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cdr.detectChanges();
      },
      error: () => this.alertas.showError('No se pudieron cargar los usuarios', 'Error'),
    });
  }

  get usuariosFiltrados(): IUsuarios[] {
    const q = this.quitarTildes(this.filtro.trim().toLowerCase());
    return this.usuarios.filter((u) => {
      const texto = this.quitarTildes(`${u.nombre} ${u.apellido} ${u.usuario_Cuenta}`.toLowerCase());
      return !q || texto.includes(q);
    });
  }

  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  esYo(u: IUsuarios): boolean {
    return !!u.usuario_Cuenta && u.usuario_Cuenta === this.api.getCuenta();
  }

  abrirNuevo(): void {
    this.modoEdicion = false;
    this.usuarioEditadoId = null;
    this.formulario = this.formularioVacio();
    this.mostrarModal = true;
  }

  abrirEditar(u: IUsuarios): void {
    this.modoEdicion = true;
    this.usuarioEditadoId = u.usuarioId ?? null;
    this.formulario = {
      nombre: u.nombre ?? '',
      apellido: u.apellido ?? '',
      usuario_Cuenta: u.usuario_Cuenta ?? '',
      password: '',
      email: u.email ?? '',
      role: u.role ?? 'profes',
      activo: u.activo ?? false,
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardar(): void {
    if (!this.formulario.usuario_Cuenta?.trim()) {
      this.alertas.showError('El usuario es obligatorio', 'Error');
      return;
    }
    if (!this.modoEdicion && !this.formulario.password?.trim()) {
      this.alertas.showError('La contraseña es obligatoria', 'Error');
      return;
    }

    const peticion = this.modoEdicion && this.usuarioEditadoId
      ? this.api.putUsuario(this.usuarioEditadoId, this.formulario)
      : this.api.postUsuario(this.formulario);

    peticion.subscribe({
      next: () => {
        this.alertas.showSuccess(this.modoEdicion ? 'Usuario actualizado' : 'Usuario creado', 'Hecho');
        this.mostrarModal = false;
        this.cargarUsuarios();
      },
      error: (err) => {
        const mensaje = err?.error?.result?.mensaje || 'No se pudo guardar el usuario';
        this.alertas.showError(mensaje, 'Error');
      },
    });
  }

  toggleActivo(u: IUsuarios): void {
    if (this.esYo(u)) {
      this.alertas.showError('No puedes desactivar tu propia cuenta', 'Error');
      return;
    }

    const nuevoEstado = !(u.activo ?? false);
    this.api.putUsuario(u.usuarioId!, {
      nombre: u.nombre,
      apellido: u.apellido,
      usuario_Cuenta: u.usuario_Cuenta,
      email: u.email,
      role: u.role,
      activo: nuevoEstado,
    }).subscribe({
      next: () => {
        this.alertas.showSuccess(nuevoEstado ? 'Usuario activado' : 'Usuario desactivado', 'Hecho');
        this.cargarUsuarios();
      },
      error: () => this.alertas.showError('No se pudo cambiar el estado', 'Error'),
    });
  }

  borrar(u: IUsuarios): void {
    if (this.esYo(u)) {
      this.alertas.showError('No puedes eliminar tu propia cuenta', 'Error');
      return;
    }
    if (!window.confirm(`¿Eliminar al usuario ${u.nombre} ${u.apellido}?`)) {
      return;
    }
    this.api.deleteUsuario(u.usuarioId!).subscribe({
      next: () => {
        this.alertas.showSuccess('Usuario eliminado', 'Hecho');
        this.cargarUsuarios();
      },
      error: () => this.alertas.showError('No se pudo eliminar', 'Error'),
    });
  }

  enviarReset(u: IUsuarios): void {
    if (!u.email?.trim()) {
      this.alertas.showError('Este usuario no tiene correo registrado', 'Error');
      return;
    }
    this.api.sendResetPasswordLink(u.email.trim()).subscribe({
      next: () => this.alertas.showSuccess(`Correo de cambio de contraseña enviado a ${u.email}`, 'Hecho'),
      error: (err) => {
        const mensaje = err?.error?.message || 'No se pudo enviar el correo';
        this.alertas.showError(mensaje, 'Error');
      },
    });
  }

  etiquetaRole(role?: string): string {
    switch (role) {
      case 'administrador':
        return 'Administrador';
      case 'lidere':
        return 'Líder';
      case 'profes':
        return 'Profesor';
      default:
        return role || '—';
    }
  }

  iniciales(u: IUsuarios): string {
    const n = u.nombre?.[0]?.toUpperCase() ?? '';
    const a = u.apellido?.[0]?.toUpperCase() ?? '';
    return `${n}${a}` || '?';
  }
}
