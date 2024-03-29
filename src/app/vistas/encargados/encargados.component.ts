import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Servicios/api/api.service';
import { Router } from '@angular/router';

import { IListaEcargados } from '../../modelos/listaencargados.interfase';

@Component({
  selector: 'app-encargados',
  templateUrl: './encargados.component.html',
  styleUrls: ['./encargados.component.css']
})
export class EncargadosComponent implements OnInit {

  encargados:IListaEcargados[] = [];
  filtroNombre: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  maxSize: number = 50; // Puedes ajustar el tamaño máximo de la paginación aquí
  totalItems: number = 0;

  constructor(private api:ApiService, private router:Router){}

  ngOnInit(): void{
    this.api.getAllEncargados(1).subscribe(data =>{
      this.encargados = data;
      
    })
  }

  editarEncargados(id: any){
    this.router.navigate(['editar', id])
  }

  nuevoEncargado(){
    this.router.navigate(['nuevo']);
  }

  filtrar() {
    // Filtra la lista de encargados por el nombre o apellido ingresado en el filtro
    this.api.getAllEncargados(1).subscribe(data => {
      const filtroSinTildes = this.quitarTildes(this.filtroNombre.toLowerCase());

      this.encargados = data.filter(encargado =>
        this.quitarTildes(encargado.nombre.toLowerCase()).includes(filtroSinTildes) ||
        this.quitarTildes(encargado.apellido.toLowerCase()).includes(filtroSinTildes)
      );
    });
}

quitarTildes(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

pageChanged(event: any): void {
  this.currentPage = event;
  this.encargados;
}

salir(){
  this.router.navigate(['dashboard']);
}

logout() {
  localStorage.removeItem('token');
  this.router.navigate(['login']);
}



}
