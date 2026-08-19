import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { PROVINCIAS } from '../../modelos/ubicaciones';

@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css'],
})
export class NuevoComponent {
  provincias = PROVINCIAS;

  nuevoForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    provincia: new FormControl(''),
    canton: new FormControl(''),
    distrito: new FormControl(''),
    direccion: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
  });

  constructor(
    private api: ApiService,
    private router: Router,
    private alertas: AlertasService,
  ) {}

  get cantones() {
    const p = this.provincias.find(p => p.nombre === this.nuevoForm.value.provincia);
    return p ? p.cantones : [];
  }

  get distritos() {
    const c = this.cantones.find(c => c.nombre === this.nuevoForm.value.canton);
    return c ? c.distritos : [];
  }

  onProvinciaChange(): void {
    this.nuevoForm.patchValue({ canton: '', distrito: '' });
  }

  onCantonChange(): void {
    this.nuevoForm.patchValue({ distrito: '' });
  }

  postForm(form: any) {
    this.api.postEncargado(form).subscribe(data => {
      const respuesta: IResponse = data;
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
