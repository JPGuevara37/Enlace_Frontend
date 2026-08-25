import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { FotoRecorteComponent } from '../../componentes/foto-recorte/foto-recorte.component';

@Component({
  selector: 'app-nuevo-profesores',
  standalone: true,
  imports: [ReactiveFormsModule, FotoRecorteComponent],
  templateUrl: './nuevo-profesores.component.html',
  styleUrl: './nuevo-profesores.component.css',
})
export class NuevoProfesoresComponent {
  avatarPreview = '';
  recortando = false;
  fotoPendiente = '';

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
      this.fotoPendiente = reader.result as string;
      this.recortando = true;
    };
    reader.readAsDataURL(file);
  }

  aplicarFoto(dataUrl: string): void {
    this.avatarPreview = dataUrl;
    this.nuevoForm.patchValue({ avatar: dataUrl });
    this.recortando = false;
  }

  cerrarRecorte(): void {
    this.recortando = false;
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
