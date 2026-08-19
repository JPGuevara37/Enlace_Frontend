import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponse } from '../../modelos/response.interfase';
import { IEncargado } from '../../modelos/encargado.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { HeaderComponent } from '../../plantillas/header/header.component';
import { FooterComponent } from '../../plantillas/footer/footer.component';

@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  nuevoForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    direccion: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
    token: new FormControl(''),
  });

  constructor(private api: ApiService, private router: Router, private alertas: AlertasService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      let token = localStorage.getItem('token');
      if (token) {
        this.nuevoForm.patchValue({ token: token });
      }
    } else {
      console.warn('No se puede acceder a localStorage en este entorno.');
    }
  }

  postForm(form: any) {
    this.api.postEncargado(form).subscribe(data => {
      let respuesta: IResponse = data;
      if (respuesta.status == 'ok') {
        this.alertas.showSuccess('Nuevo encargado insertado', 'Hecho');
        this.router.navigate(['encargados']);
      } else {
        this.alertas.showError(respuesta.result?.error_msj, 'Error');
      }
    });
  }

  salir() {
    this.router.navigate(['encargados']);
  }
}
