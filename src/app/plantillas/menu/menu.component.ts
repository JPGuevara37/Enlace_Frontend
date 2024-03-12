import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  isMenuOpen: boolean = false;
  
  constructor(private router: Router, private elementRef: ElementRef, private renderer:Renderer2) {}
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      this.renderer.removeClass(this.elementRef.nativeElement, 'hide-sidebar');
      this.renderer.addClass(this.elementRef.nativeElement, 'show-sidebar');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'show-sidebar');
      this.renderer.addClass(this.elementRef.nativeElement, 'hide-sidebar');
    }
  }

  showMenu() {
    this.isMenuOpen = true;
    this.renderer.removeClass(this.elementRef.nativeElement, 'hide-sidebar');
    this.renderer.addClass(this.elementRef.nativeElement, 'show-sidebar');
  }

  hideMenu() {
    this.isMenuOpen = false;
    this.renderer.removeClass(this.elementRef.nativeElement, 'show-sidebar');
    this.renderer.addClass(this.elementRef.nativeElement, 'hide-sidebar');
  }

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

  materialPage() {
    this.router.navigate(['/material']); // Asegúrate de usar el prefijo '/'
  }

  salir(){
    this.router.navigate(['dashboard']);
  }



}
