import { ApiService } from '../Servicios/api/api.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private api: ApiService, private router: Router, private toast: NgToastService){

  }
  canActivate():boolean{
    if(this.api.isloggedIn()){
      return true
    }else{
      this.toast.error({detail:"ERROR", summary:"por favor acceda primero"});
      this.router.navigate(['login'])
      return false;
    }
  }

}
