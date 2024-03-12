import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ApiService } from '../../Servicios/api/api.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'chart.js';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Variables para el área
  public areaChartOptions: ChartOptions = {
    responsive: true,
  };
  public areaChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public areaChartType: ChartType = 'line';
  public areaChartLegend = true;
  public areaChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];

  // Variables para la barra
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];

  // Variables para el donut
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  
  
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