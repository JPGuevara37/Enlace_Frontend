import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Servicios/api/api.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  sidebarOpen = false;

  constructor(private router: Router, private api: ApiService) {}

  get esAdmin(): boolean {
    return this.api.isAdmin();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  cerrarSidebar(): void {
    this.sidebarOpen = false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    this.router.navigate(['login']);
  }
}
