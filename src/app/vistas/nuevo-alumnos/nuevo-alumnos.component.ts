import { Component } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IAlumnos } from '../../modelos/alumnos.interfase';
import { IListaAlumnos } from '../../modelos/listaalumnos.interfase';
import { IListaEdades } from '../../modelos/listaedades.interfase';
import { IListaEcargados } from '../../modelos/listaencargados.interfase';



@Component({
  selector: 'app-nuevo-alumnos',
  templateUrl: './nuevo-alumnos.component.html',
  styleUrl: './nuevo-alumnos.component.css'
})
export class NuevoAlumnosComponent {

  datePipe: any;
  alumnos: IListaAlumnos[] | undefined;
  encargados: IListaEcargados[] | undefined;
  edades: IListaEdades[] | undefined;
  filtroNombre: string = '';

  nuevoForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    direccion: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
    token: new FormControl(''),
    encargadoId: new FormControl(''),
    edadId: new FormControl(''),
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

    this.api.getAllEncargados(1).subscribe((data) => {
      this.encargados = data;
      console.log('Encargados:', this.encargados);

      // Lógica de filtrado después de obtener los encargados
      this.filtrarEncargados();
    });

    this.api.getAllEdades(1).subscribe((data) => {
      this.edades = data;
    });
  }

  filtrarEncargados() {
    // Filtra la lista de encargados por el nombre o apellido ingresado en el filtro
    if (this.encargados && this.encargados.length > 0) {
      this.alumnos = this.alumnos?.map((alumno) => ({
        ...alumno,
        nombreEncargado: this.getNombreEncargado(alumno.encargadoId),
      }));
    }
  }

  postForm(form:IAlumnos){
    this.api.postAlumno(form).subscribe( data => {
      let respuesta : IResponse = data;
      console.log(data)
      if(respuesta.status == "ok"){
        this.alertas.showSuccess('Nuevo Alumno insertado','Hecho')
        this.router.navigate(['alumnos']);
      }else{
        this.alertas.showError(respuesta.result?.error_msj,'Error');
      }
    })

  }

  salir(){
    this.router.navigate(['alumnos']);
  }

  getNombreEncargado(encargadoId: string): string {
    const encargado = this.encargados?.find((e) => e.encargadoId === encargadoId);
    return encargado ? `${encargado.nombre} ${encargado.apellido}` : '';
  }

}
