import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Servicios/api/api.service';
import { Router } from '@angular/router';
import { IListaProfesores } from '../../modelos/listaprofesores.interfase';

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrl: './profesores.component.css'
})
export class ProfesoresComponent {

  profesores:IListaProfesores[] = [];
  filtroNombre: string = '';
  itemsPerPage: number = 5;
  currentPage: number = 1;
  maxSize: number = 50; // Puedes ajustar el tamaño máximo de la paginación aquí
  totalItems: number = 0;
  

  constructor(private api:ApiService, private router:Router){}

  ngOnInit(): void{
    this.api.getAllProfesores(1).subscribe(data =>{
      this.profesores = data;
      
    })
}

encargadosPage() {
  this.router.navigate(['/encargados']); // Asegúrate de usar el prefijo '/'
}

alumnosPage() {
  this.router.navigate(['/alumnos']); // Asegúrate de usar el prefijo '/'
}

profesoresPage() {
  this.router.navigate(['/profesores']); // Asegúrate de usar el prefijo '/'
}

recursosPage() {
  this.router.navigate(['/recursos']); // Asegúrate de usar el prefijo '/'
}

editarProfesores(id: any){
  this.router.navigate(['editar-profesores', id])
}

nuevoProfesores(){
  this.router.navigate(['nuevo-profesores']);
}

filtrar() {
  // Filtra la lista de encargados por el nombre o apellido ingresado en el filtro
  this.api.getAllProfesores(1).subscribe(data => {
    const filtroSinTildes = this.quitarTildes(this.filtroNombre.toLowerCase());

    this.profesores = data.filter(profesor =>
      this.quitarTildes(profesor.nombre.toLowerCase()).includes(filtroSinTildes) ||
      this.quitarTildes(profesor.apellido.toLowerCase()).includes(filtroSinTildes)
    );
  });
}

quitarTildes(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

pageChanged(event: any): void {
  this.currentPage = event;
  this.profesores;
}

salir(){
this.router.navigate(['dashboard']);
}



}
