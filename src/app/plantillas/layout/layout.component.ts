import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../../Servicios/api/api.service';
import { IPerfilGuardar } from '../../modelos/perfil.interfase';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnDestroy {
  sidebarOpen = false;
  enConfiguracion = false;
  menuAbierto = false;

  subItems = [
    { ruta: '/configuracion/usuarios', icono: 'fa-users', titulo: 'Usuarios' },
    { ruta: '/configuracion/metas', icono: 'fa-bullseye', titulo: 'Metas del año' },
    { ruta: '/configuracion/actividades', icono: 'fa-calendar-star', titulo: 'Actividades principales' },
  ];

  mostrarPerfil = false;
  perfilForm: IPerfilGuardar = { nombre: '', apellido: '', usuario_Cuenta: '', email: '', avatar: '' };
  passwordActual = '';
  passwordNueva = '';
  passwordConfirmar = '';

  private routerSub: Subscription;

  constructor(
    private router: Router,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private toast: NgToastService,
  ) {
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.enConfiguracion = this.router.url.startsWith('/configuracion');
      });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  get esAdmin(): boolean {
    return this.api.isAdmin();
  }

  get esGestor(): boolean {
    return ['administrador', 'lidere'].includes(this.api.getRole());
  }

  get iniciales(): string {
    const n = (this.api.getNombre() || '').trim();
    const a = (this.api.getApellido() || '').trim();
    return ((n.charAt(0) || '') + (a.charAt(0) || '')).toUpperCase() || '?';
  }

  get nombreCompleto(): string {
    return this.api.getNombreCompleto();
  }

  get avatarMostrado(): string {
    return this.api.getAvatar();
  }

  get cuentaActual(): string {
    return this.api.getCuenta();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  cerrarSidebar(): void {
    this.sidebarOpen = false;
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  irAPerfil(): void {
    this.cerrarMenu();
    this.abrirPerfil();
  }

  abrirPerfil(): void {
    this.mostrarPerfil = true;
    this.cargarPerfil();
  }

  cerrarPerfil(): void {
    this.mostrarPerfil = false;
  }

  cargarPerfil(): void {
    this.api.getPerfil().subscribe({
      next: (p) => {
        this.perfilForm = {
          nombre: p.nombre ?? '',
          apellido: p.apellido ?? '',
          usuario_Cuenta: p.usuario_Cuenta ?? '',
          email: p.email ?? '',
          avatar: p.avatar ?? '',
        };
        this.passwordActual = '';
        this.passwordNueva = '';
        this.passwordConfirmar = '';
        this.cdr.detectChanges();
      },
      error: () => this.toast.error({ detail: 'Error', summary: 'No se pudo cargar el perfil', duration: 3000 }),
    });
  }

  guardarPerfil(): void {
    if (!this.perfilForm.usuario_Cuenta?.trim()) {
      this.toast.error({ detail: 'Error', summary: 'El usuario es obligatorio', duration: 3000 });
      return;
    }

    this.api.putPerfil(this.perfilForm).subscribe({
      next: () => {
        window.localStorage.setItem('nombre', this.perfilForm.nombre ?? '');
        window.localStorage.setItem('apellido', this.perfilForm.apellido ?? '');
        window.localStorage.setItem('cuenta', this.perfilForm.usuario_Cuenta ?? '');
        window.localStorage.setItem('avatar', this.perfilForm.avatar ?? '');
        this.cdr.detectChanges();
        this.toast.success({ detail: 'Perfil actualizado', summary: 'Cambios guardados', duration: 3000 });
      },
      error: (err) => {
        const mensaje = err?.error?.result?.mensaje || 'No se pudo guardar el perfil';
        this.toast.error({ detail: 'Error', summary: mensaje, duration: 3000 });
      },
    });
  }

  cambiarPassword(): void {
    if (!this.passwordActual || !this.passwordNueva) {
      this.toast.error({ detail: 'Error', summary: 'Completa la contraseña actual y la nueva', duration: 3000 });
      return;
    }
    if (this.passwordNueva !== this.passwordConfirmar) {
      this.toast.error({ detail: 'Error', summary: 'Las contraseñas nuevas no coinciden', duration: 3000 });
      return;
    }

    this.api.cambiarPassword({ passwordActual: this.passwordActual, passwordNueva: this.passwordNueva }).subscribe({
      next: () => {
        this.passwordActual = '';
        this.passwordNueva = '';
        this.passwordConfirmar = '';
        this.toast.success({ detail: 'Contraseña actualizada', summary: 'Listo', duration: 3000 });
      },
      error: (err) => {
        const mensaje = err?.error?.result?.mensaje || 'No se pudo cambiar la contraseña';
        this.toast.error({ detail: 'Error', summary: mensaje, duration: 3000 });
      },
    });
  }

  onAvatarSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        const lado = Math.min(img.width, img.height);
        const sx = (img.width - lado) / 2;
        const sy = (img.height - lado) / 2;
        ctx.drawImage(img, sx, sy, lado, lado, 0, 0, size, size);
        this.perfilForm.avatar = canvas.toDataURL('image/jpeg', 0.9);
        this.cdr.detectChanges();
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  quitarAvatar(): void {
    this.perfilForm.avatar = '';
    this.cdr.detectChanges();
  }

  logout() {
    this.api.logout();
    this.router.navigate(['login']);
  }
}
