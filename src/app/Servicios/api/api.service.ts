import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { ILogin } from '../../modelos/login.interfase';
import { IResponse } from '../../modelos/response.interfase';
import { IListaEcargados } from '../../modelos/listaencargados.interfase';
import { IEncargado } from '../../modelos/encargado.interfase';
import { HttpClient , HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { format } from 'path';
import { IListaProfesores } from '../../modelos/listaprofesores.interfase';
import { IProfesores } from '../../modelos/profesores.interfase';
import { IAlumnos } from '../../modelos/alumnos.interfase';
import { IListaAlumnos } from '../../modelos/listaalumnos.interfase';
import { IListaRecursos } from '../../modelos/listarecursos.interfase';
import { IRecursos } from '../../modelos/recursos.interfase';
import { IListaEdades } from '../../modelos/listaedades.interfase';
import { IEdades } from '../../modelos/Edades.interfase';
import { isPlatformBrowser } from '@angular/common';
import { ResetPassword } from '../../modelos/resetPassword.interfase';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url:string = "https://api-enlace.azurewebsites.net";

  //http://localhost:5066
  //https://api-enlace.azurewebsites.net

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }
  //servicio de login.
  login(loginObj:any){
    let direccion = this.url + "/api/autenticar/authenticate";
    return this.http.post<any>(direccion, loginObj)
  }
  //servicio de registro
  singUP(usuarioObj:any){
    let direccion = this.url + "/api/autenticar/register";
    return this.http.post<any>(direccion, usuarioObj)
  }
  //servicio de guards Token
  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue)
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isloggedIn(): boolean {
    // Verificar si se está ejecutando en el navegador antes de acceder a localStorage
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  isTokenExpired(): boolean {
    if (typeof localStorage === 'undefined') {
      return true; // Tratar como token expirado si localStorage no está definido
    }

    const tokenExpirationString = localStorage.getItem('tokenExpiration');

    if (!tokenExpirationString) {
      localStorage.removeItem("Token");
      // No hay fecha de expiración almacenada, el token se considera expirado
      return true;
    }
  
    const tokenExpiration = new Date(tokenExpirationString);
    const currentDateTime = new Date();
  
    // Verificar si la fecha de expiración es anterior a la fecha y hora actuales
    return tokenExpiration <= currentDateTime;
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

//servicio de para Alumnos
  getAllAlumnos(page:number):Observable<IListaAlumnos[]>{
    let direccion = this.url + "/api/alumnos";
    return this.http.get<IListaAlumnos[]>(direccion);
  }

  getSingleAlumno(id: any):Observable<IAlumnos>{
    let direccion = this.url + "/api/alumnos/" + id;
    return this.http.get<IAlumnos>(direccion);
  }

  putAlumnos(form: any): Observable<IResponse> {
    let direccion = this.url + "/api/alumnos/" + form.alumnoId;
    return this.http.put<IResponse>(direccion, form);
  }

  deleteAlumnos(form: IAlumnos):Observable<IResponse>{
    let direccion = this.url + "/api/alumnos/" + form.alumnoId;
    let Options = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: form
    }
    return this.http.delete<IResponse>(direccion);
  }

  postAlumno(form:IAlumnos):Observable<IResponse>{
    let direccion = this.url + "/api/alumnos";
    return this.http.post<IResponse>(direccion, form);
  }  

  //servicio para Profesores
    getAllProfesores(page:number):Observable<IListaProfesores[]>{
      let direccion = this.url + "/api/profesores";
      return this.http.get<IListaProfesores[]>(direccion);
    }

    getSingleProfesor(id: any):Observable<IEncargado>{
      let direccion = this.url + "/api/profesores/" + id;
      return this.http.get<IProfesores>(direccion);
    }

    putProfesores(form: any): Observable<IResponse> {
      let direccion = this.url + "/api/profesores/" + form.profesorId;
      return this.http.put<IResponse>(direccion, form);
    }

    deleteProfesor(form: IProfesores):Observable<IResponse>{
      let direccion = this.url + "/api/profesores/" + form.profesorId;
      let Options = {
        headers : new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: form
      }
      return this.http.delete<IResponse>(direccion);
    }

    postProfesor(form:IProfesores):Observable<IResponse>{
      let direccion = this.url + "/api/profesores";
      return this.http.post<IResponse>(direccion, form);
    }  

    //Servicio de Recursos
    getAllRecursos(page:number):Observable<IListaRecursos[]>{
      let direccion = this.url + "/api/recursos";
      return this.http.get<IListaRecursos[]>(direccion);
    }

    getSingleRecurso(id: any):Observable<IRecursos>{
      let direccion = this.url + "/api/recursos/" + id;
      return this.http.get<IRecursos>(direccion);
    }

    putRecursos(form: any): Observable<IResponse> {
      let direccion = this.url + "/api/recursos/" + form.recursosId;
      return this.http.put<IResponse>(direccion, form);
    }

    deleteRecurso(form: IRecursos):Observable<IResponse>{
      let direccion = this.url + "/api/recursos/" + form.recursosId;
      let Options = {
        headers : new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: form
      }
      return this.http.delete<IResponse>(direccion);
    }

    postRecurso(form:IRecursos):Observable<IResponse>{
      let direccion = this.url + "/api/recursos";
      return this.http.post<IResponse>(direccion, form);
    }  

    //servicio para Edades

    getAllEdades(page:number):Observable<IListaEdades[]>{
      let direccion = this.url + "/api/edad";
      return this.http.get<IListaEdades[]>(direccion);
    }

    getSingleEdad(id: any):Observable<IEdades>{
      let direccion = this.url + "/api/edad/" + id;
      return this.http.get<IEdades>(direccion);
    }

    putEdades(form: any): Observable<IResponse> {
      let direccion = this.url + "/api/edad/" + form.edadId;
      return this.http.put<IResponse>(direccion, form);
    }

    deleteEdad(form: IEdades):Observable<IResponse>{
      let direccion = this.url + "/api/edad/" + form.edadId;
      let Options = {
        headers : new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: form
      }
      return this.http.delete<IResponse>(direccion);
    }

    postEdad(form:IRecursos):Observable<IResponse>{
      let direccion = this.url + "/api/edad";
      return this.http.post<IResponse>(direccion, form);
    } 
    
    getEdadById(edadId: string): Observable<IEdades> {
      const direccion = `${this.url}/api/edad/${edadId}`;
      return this.http.get<IEdades>(direccion);
    }

    sendResetPasswordLink(email: string) {
      const direccion = `${this.url}/api/ResetEmail/send-reset-email/${email}`;
      return this.http.post<any>(direccion, null); // No envíes datos en el cuerpo
   }

    resetPassword(resetPasswordObj: ResetPassword){
      return this.http.post<any>(`${this.url}/api/ResetEmail/reset-password`, resetPasswordObj);
    }

 }

