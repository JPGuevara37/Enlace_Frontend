import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoguotComponent } from '../../plantillas/loguot/loguot.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LoguotComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private router: Router) {}

  confirmLogout() {
    let isConfirmed = window.confirm('¿Estás seguro de que deseas cerrar sesión?');

    if (isConfirmed) {
      localStorage.removeItem('token');
      this.router.navigate(['login']);
    }
  }

  encargadosPage() {
    this.router.navigate(['/encargados']);
  }

  alumnosPage() {
    this.router.navigate(['/alumnos']);
  }

  profesoresPage() {
    this.router.navigate(['/profesores']);
  }

  recursosPage() {
    this.router.navigate(['/recursos']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
