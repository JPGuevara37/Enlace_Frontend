import { Component } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IProfesores } from '../../modelos/profesores.interfase';

@Component({
  selector: 'app-nuevo-profesores',
  templateUrl: './nuevo-profesores.component.html',
  styleUrl: './nuevo-profesores.component.css'
})
export class NuevoProfesoresComponent {


  nuevoForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
    token: new FormControl(''),
    //encargadoId: new FormControl('')
});

  constructor(private api:ApiService, private router:Router, private alertas:AlertasService){}

    ngOnInit(): void {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        let token = localStorage.getItem('token');
        if (token) {
          this.nuevoForm.patchValue({
            'token': token
          });
        }
      } else {
        console.warn('No se puede acceder a localStorage en este entorno.');
      }
    }

    postForm(form:IProfesores){
      this.api.postProfesor(form).subscribe( data => {
        let respuesta : IResponse = data;
        console.log(data)
        if(respuesta.status == "ok"){
          this.alertas.showSuccess('Nuevo Profe insertado','Hecho')
          this.router.navigate(['profesores']);
        }else{
          this.alertas.showError(respuesta.result?.error_msj,'Error');
        }
      })

    }

    salir(){
      this.router.navigate(['profesores']);
  }
}
