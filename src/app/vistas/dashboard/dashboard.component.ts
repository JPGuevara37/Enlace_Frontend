import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Puedes realizar alguna lógica de inicialización si es necesario
  }

  confirmLogout() {
    let isConfirmed = window.confirm('¿Estás seguro de que deseas cerrar sesión?')

    if (isConfirmed) {
      // Realizar la lógica de cierre de sesión aquí
      localStorage.removeItem('token');
      this.router.navigate(['login']);
    }
  }
  // Método para navegar a la ruta 'encargados'
  encargados() {
    this.router.navigate(['/encargados']); // Asegúrate de usar el prefijo '/'
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
