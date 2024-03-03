import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loguot',
  templateUrl: './loguot.component.html',
  styleUrl: './loguot.component.css'
})
export class LoguotComponent {

  constructor(private router:Router){}

  confirmLogout() {
    let isConfirmed = window.confirm('¿Estás seguro de que deseas cerrar sesión?')

    if (isConfirmed) {
      // Realizar la lógica de cierre de sesión aquí
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      this.router.navigate(['login']);
    }
  }
} 
