import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { IRecursos } from '../../modelos/recursos.interfase';
import { HeaderComponent } from '../../plantillas/header/header.component';
import { FooterComponent } from '../../plantillas/footer/footer.component';

@Component({
  selector: 'app-nuevo-recursos',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './nuevo-recursos.component.html',
  styleUrl: './nuevo-recursos.component.css'
})
export class NuevoRecursosComponent implements OnInit {

  nuevoForm = new FormGroup({
    articulo: new FormControl(''),
    cantidad: new FormControl(''),
    numero_Locker: new FormControl(''),
    descripcion: new FormControl(''),
    activo: new FormControl(''),
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
    this.api.postRecurso(form).subscribe(data => {
      let respuesta: IResponse = data;
      if (respuesta.status == 'ok') {
        this.alertas.showSuccess('Nuevo recurso insertado', 'Hecho');
        this.router.navigate(['recursos']);
      } else {
        this.alertas.showError(respuesta.result?.error_msj, 'Error');
      }
    });
  }

  salir() {
    this.router.navigate(['recursos']);
  }
}
