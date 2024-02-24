import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { IProfesores } from '../../modelos/profesores.interfase';


@Component({
  selector: 'app-editar-profesores',
  templateUrl: './editar-profesores.component.html',
  styleUrl: './editar-profesores.component.css'
})
export class EditarProfesoresComponent {

  constructor(private activerouter:ActivatedRoute, private router:Router, private api:ApiService, private alertas:AlertasService){ }

  datosProfesor:IProfesores | undefined;

  editarForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
    //token: new FormControl(''),
    profesorId: new FormControl('')
});

  ngOnInit(): void {
    let profesorId = this.activerouter.snapshot.paramMap.get('id');
    let token = this.getToken();
    this.api.getSingleProfesor(profesorId).subscribe(data => {
        this.datosProfesor = data;
        this.editarForm.setValue({
          'nombre': this.datosProfesor.nombre ?? '',
          'apellido': this.datosProfesor.apellido ?? '',
          'email': this.datosProfesor.email ?? '',
          'telefono': this.datosProfesor.telefono ?? '',
          //'token': token ?? '',
          'profesorId': this.datosProfesor.profesorId ?? '',
        })
    })
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    } else {
      // Manejar el caso cuando localStorage no está disponible
      return null;
    }
  }
  
  postForm(form: IProfesores) {

    this.api.putProfesores(form).subscribe( data =>{
      let respuesta : IResponse = data;
      console.log(data)
      if(respuesta.status == "ok"){
        this.alertas.showSuccess('Datos modificados','Hecho')
      }else{
        this.alertas.showError(respuesta.result?.error_msj,'Error');
      }
    })
  }

  delete(){
    let datos:IProfesores = this.editarForm.value;
    let isConfirmed = window.confirm('¿Estás seguro que quieres eliminar el usuario')

    if (isConfirmed) {
      this.api.deleteProfesor(datos).subscribe( data =>{
      let respuesta : IResponse = data;
        if(respuesta.status == "ok"){
          this.alertas.showSuccess('Datos eliminados','Hecho')
          this.router.navigate(['profesores']);
        }else{
          this.alertas.showError(respuesta.result?.error_msj,'Error');
        }
      })
    }
  }

  salir(){
    this.router.navigate(['profesores']);
  }

}
