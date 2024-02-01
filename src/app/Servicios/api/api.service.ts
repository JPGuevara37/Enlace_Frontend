import { Injectable } from '@angular/core';
import { ILogin } from '../../modelos/login.interfase';
import { IResponse } from '../../modelos/response.interfase';
import { IListaEcargados } from '../../modelos/listaencargados.interfase';
import { IEncargado } from '../../modelos/encargado.interfase';
import { HttpClient , HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { format } from 'path';
import e from 'express';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url:string = "http://localhost:5066";

  constructor(private http:HttpClient) { }
//servicio de login.
  LoginByEmail(form:ILogin):Observable<IResponse>{
    let direccion = this.url + "/api/autenticar";
    return this.http.post<Response>(direccion,form);
  }
//servicio de para encargados.
  getAllEncargados(page:number):Observable<IListaEcargados[]>{
    let direccion = this.url + "/api/encargados";
    return this.http.get<IListaEcargados[]>(direccion);
  }

  getSingleEncargado(id: any):Observable<IEncargado>{
    let direccion = this.url + "/api/encargados/" + id;
    return this.http.get<IEncargado>(direccion);
  }

  putEncargado(form: any): Observable<IResponse> {
    let direccion = this.url + "/api/encargados/" + form.encargadoId;
    return this.http.put<IResponse>(direccion, form);
  }

  deleteEncargado(form: IEncargado):Observable<IResponse>{
    let direccion = this.url + "/api/encargados/" + form.encargadoId;
    let Options = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: form
    }
    return this.http.delete<IResponse>(direccion);
  }

  postEncargado(form:IEncargado):Observable<IResponse>{
    let direccion = this.url + "/api/encargados";
    return this.http.post<IResponse>(direccion, form);
  }
}
