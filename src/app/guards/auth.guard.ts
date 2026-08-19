import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../Servicios/api/api.service';

export const authGuard: CanActivateFn = () => {
  const api = inject(ApiService);
  const router = inject(Router);

  if (api.isloggedIn() && !api.isTokenExpired()) {
    return true;
  }

  api.logout();
  router.navigate(['login']);
  return false;
};
