import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { IProfesores } from '../../modelos/profesores.interfase';
import { HeaderComponent } from '../../plantillas/header/header.component';
import { FooterComponent } from '../../plantillas/footer/footer.component';

@Component({
  selector: 'app-nuevo-profesores',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './nuevo-profesores.component.html',
  styleUrl: './nuevo-profesores.component.css'
})
export class NuevoProfesoresComponent implements OnInit {

  nuevoForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
  });

  constructor(private api: ApiService, private router: Router, private alertas: AlertasService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      let token = localStorage.getItem('token');
      if (token) {
        this.nuevoForm.patchValue({});
      }
    } else {
      console.warn('No se puede acceder a localStorage en este entorno.');
    }
  }

  postForm(form: any) {
    this.api.postProfesor(form).subscribe(data => {
      let respuesta: IResponse = data;
      if (respuesta.status == 'ok') {
        this.alertas.showSuccess('Nuevo Profe insertado', 'Hecho');
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
