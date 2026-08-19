import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../Servicios/api/api.service';
import { NgToastService } from 'ng-angular-popup';

export const authGuard: CanActivateFn = () => {
  const api = inject(ApiService);
  const router = inject(Router);
  const toast = inject(NgToastService);

  if (api.isloggedIn() && !api.isTokenExpired()) {
    return true;
  }

  api.logout();
  toast.error({ detail: 'ERROR', summary: 'por favor acceda primero' });
  router.navigate(['login']);
  return false;
};
