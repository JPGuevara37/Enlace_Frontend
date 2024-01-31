import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Servicios/api/api.service';
import { Router } from '@angular/router';

import { IListaEcargados } from '../../modelos/listaencargados.interfase';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  encargados:IListaEcargados[] | undefined;

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

}
