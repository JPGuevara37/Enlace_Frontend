import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Servicios/api/api.service';
import { Router } from '@angular/router';


import { IListaRecursos } from '../../modelos/listarecursos.interfase';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrl: './recursos.component.css'
})
export class RecursosComponent {

  recursos:IListaRecursos[] | undefined;
  filtroNombre: string = '';

  constructor(private api:ApiService, private router:Router){}

  ngOnInit(): void{
    this.api.getAllRecursos(1).subscribe(data =>{
      this.recursos = data;
      
    })
  }

  editarRecursos(id: any){
    this.router.navigate(['editar-recursos', id])
  }

  nuevoRecurso(){
    this.router.navigate(['nuevo-recursos']);
  }

  filtrar() {
    // Filtra la lista de encargados por el nombre o apellido ingresado en el filtro
    this.api.getAllRecursos(1).subscribe(data => {
      const filtroSinTildes = this.quitarTildes(this.filtroNombre.toLowerCase());

      this.recursos = data.filter(encargado =>
        this.quitarTildes(encargado.articulo.toLowerCase()).includes(filtroSinTildes)
      );
    });
}

  quitarTildes(texto: string): string {
      return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  salir(){
    this.router.navigate(['dashboard']);
  }

}
