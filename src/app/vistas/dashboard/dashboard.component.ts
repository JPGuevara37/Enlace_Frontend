import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ApiService } from '../../Servicios/api/api.service';
import { ChartType, ChartOptions } from 'chart.js';



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
  encargadosPage() {
    this.router.navigate(['/encargados']); // Asegúrate de usar el prefijo '/'
  }

  alumnosPage() {
    this.router.navigate(['/alumnos']); // Asegúrate de usar el prefijo '/'
  }

  profesoresPage() {
    this.router.navigate(['/profesores']); // Asegúrate de usar el prefijo '/'
  }

  recursosPage() {
    this.router.navigate(['/recursos']); // Asegúrate de usar el prefijo '/'
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }


  
}