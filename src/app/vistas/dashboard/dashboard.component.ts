import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ApiService } from '../../Servicios/api/api.service';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';



;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  title = 'ng2-charts-demo';

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = [ [ 'Download', 'Sales' ], [ 'In', 'Store', 'Sales' ], 'Mail Sales' ];
  public pieChartDatasets = [ {
    data: [ 300, 500, 100 ]
  } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  
  constructor(private router: Router, private pieChart: ElementRef) {}

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