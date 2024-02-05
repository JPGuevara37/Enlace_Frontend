import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { IProfesores } from '../../modelos/profesores.interfase';
import { IAlumnos } from '../../modelos/alumnos.interfase';

@Component({
  selector: 'app-editar-alumnos',
  templateUrl: './editar-alumnos.component.html',
  styleUrl: './editar-alumnos.component.css'
})
export class EditarAlumnosComponent {

  constructor(
    private activerouter:ActivatedRoute, 
    private router:Router, 
    private api:ApiService, 
    private alertas:AlertasService
    ){}

  datosAlumno:IAlumnos | undefined;

  editarForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    fechaNacimiento: new FormControl(''),// 'fechanacimiento' ahora es de tipo Date | null
    direccion: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
    alumnoId: new FormControl(''),
    encargadoId: new FormControl(''),
    edadId: new FormControl(''),
  });


  ngOnInit(): void {
    let alumnoId = this.activerouter.snapshot.paramMap.get('id');
    let token = this.getToken();
    this.api.getSingleAlumno(alumnoId).subscribe(data => {
        this.datosAlumno = data;
        this.editarForm.setValue({
          'nombre': this.datosAlumno.nombre ?? '',
          'apellido': this.datosAlumno.apellido ?? '',
          'fechaNacimiento': this.datosAlumno.fechaNacimiento ?? '',
          'direccion': this.datosAlumno.direccion ?? '',
          'email': this.datosAlumno.email ?? '',
          'telefono': this.datosAlumno.telefono ?? '',
          //'token': token ?? '',
          'alumnoId': this.datosAlumno.alumnoId ?? '',
          'encargadoId': this.datosAlumno.encargadoId ?? '',
          'edadId': this.datosAlumno.edadId ?? '',
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
  
  postForm(form: IAlumnos) {

    this.api.putAlumnos(form).subscribe( data =>{
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
    let datos:IAlumnos = this.editarForm.value;
    let isConfirmed = window.confirm('¿Estás seguro que quieres eliminar el usuario')

    if (isConfirmed) {
      this.api.deleteAlumnos(datos).subscribe( data =>{
      let respuesta : IResponse = data;
        if(respuesta.status == "ok"){
          this.alertas.showSuccess('Datos eliminados','Hecho')
          this.router.navigate(['alumnos']);
        }else{
          this.alertas.showError(respuesta.result?.error_msj,'Error');
        }
      })
    }
  }

  salir(){
    this.router.navigate(['alumnos']);
  }

}
