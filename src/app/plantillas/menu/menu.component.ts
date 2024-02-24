import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  constructor(private router: Router) {}

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

  salir(){
    this.router.navigate(['dashboard']);
  }



}
