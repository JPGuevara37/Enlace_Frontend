import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';

@Component({
  selector: 'app-nuevo-profesores',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './nuevo-profesores.component.html',
  styleUrl: './nuevo-profesores.component.css',
})
export class NuevoProfesoresComponent {
  avatarPreview = '';

  nuevoForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
    categoria: new FormControl('Profesor'),
    avatar: new FormControl(''),
  });

  constructor(
    private api: ApiService,
    private router: Router,
    private alertas: AlertasService,
  ) {}

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
      this.nuevoForm.patchValue({ avatar: this.avatarPreview });
    };
    reader.readAsDataURL(file);
  }

  quitarFoto(): void {
    this.avatarPreview = '';
    this.nuevoForm.patchValue({ avatar: '' });
  }

  postForm(form: any) {
    this.api.postProfesor(form).subscribe(data => {
      const respuesta: IResponse = data;
      if (respuesta.status == 'ok') {
        this.alertas.showSuccess('Nuevo profesor insertado', 'Hecho');
        this.router.navigate(['profesores']);
      } else {
        this.alertas.showError(respuesta.result?.error_msj, 'Error');
      }
    });
  }

  salir() {
    this.router.navigate(['profesores']);
  }
}
