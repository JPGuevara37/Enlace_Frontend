import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ApiService } from '../../Servicios/api/api.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnDestroy {
  sidebarOpen = false;
  enConfiguracion = false;

  subItems = [
    { ruta: '/configuracion/usuarios', icono: 'fa-users', titulo: 'Usuarios' },
  ];

  private routerSub: Subscription;

  constructor(private router: Router, private api: ApiService) {
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

  get iniciales(): string {
    const n = (this.api.getNombre() || '').trim();
    const a = (this.api.getApellido() || '').trim();
    return ((n.charAt(0) || '') + (a.charAt(0) || '')).toUpperCase() || '?';
  }

  get nombreCompleto(): string {
    return this.api.getNombreCompleto();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  cerrarSidebar(): void {
    this.sidebarOpen = false;
  }

  logout() {
    this.api.logout();
    this.router.navigate(['login']);
  }
}
