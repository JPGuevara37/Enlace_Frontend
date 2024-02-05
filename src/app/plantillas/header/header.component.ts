import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router:Router){}

  confirmLogout() {
    let isConfirmed = window.confirm('¿Estás seguro de que deseas cerrar sesión?')

    if (isConfirmed) {
      // Realizar la lógica de cierre de sesión aquí
      localStorage.removeItem('token');
      this.router.navigate(['login']);
    }
  }


}
