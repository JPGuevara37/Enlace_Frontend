import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Servicios/api/api.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { IListaAlumnos } from '../../modelos/listaalumnos.interfase';
import { IListaEcargados } from '../../modelos/listaencargados.interfase';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.css'
})
export class AlumnosComponent {


  alumnos:IListaAlumnos[] | undefined;
  encargados:IListaEcargados[] | undefined;
  edades: any[] = [];
  filtroNombre: string = '';


  constructor(
    private api:ApiService, 
    private router:Router,
    private datePipe: DatePipe
    ){}

  ngOnInit(): void{
    this.api.getAllAlumnos(1).subscribe(data =>{
      console.log(data);
      this.alumnos = data;
    })
    
    this.api.getAllEncargados(1).subscribe(data => {
      this.encargados = data;
      console.log('Encargados:', this.encargados);
      
      // Lógica de filtrado después de obtener los encargados
      this.filtrarEncargados();
    });

    /*this.api.getAllEdades(1).subscribe(data => {
      this.edades = data;
    });*/
  }

  filtrarEncargados() {
    // Filtra la lista de encargados por el nombre o apellido ingresado en el filtro
    if (this.encargados && this.encargados.length > 0) {
      this.alumnos = this.alumnos?.map(alumno => ({
        ...alumno,
        nombreEncargado: this.getNombreEncargado(alumno.encargadoId)
      }));
    }
  }

  editarAlumnos(id: any){
    this.router.navigate(['editar-alumnos', id])
  }

  nuevoAlumnos(){
    this.router.navigate(['nuevo-alumnos']);
  }


  filtrar() {
    // Filtra la lista de encargados por el nombre o apellido ingresado en el filtro
    this.api.getAllAlumnos(1).subscribe(data => {
      const filtroSinTildes = this.quitarTildes(this.filtroNombre.toLowerCase());

      this.alumnos = data.filter(encargado =>
        this.quitarTildes(encargado.nombre.toLowerCase()).includes(filtroSinTildes) ||
        this.quitarTildes(encargado.apellido.toLowerCase()).includes(filtroSinTildes)
      );
    });
}

  quitarTildes(texto: string): string {
      return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  salir(){
    this.router.navigate(['dashboard']);
  }

  getNombreEncargado(encargadoId: string): string {
    const encargado = this.encargados?.find(e => e.encargadoId === encargadoId);
    return encargado ? `${encargado.nombre} ${encargado.apellido}` : '';
  }
}

