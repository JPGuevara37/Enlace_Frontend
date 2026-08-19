import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  isMenuOpen: boolean = false;

  constructor(private router: Router, private elementRef: ElementRef, private renderer: Renderer2) {}

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

  materialPage() {
    this.router.navigate(['/material']);
  }

  salir() {
    this.router.navigate(['dashboard']);
  }
}
