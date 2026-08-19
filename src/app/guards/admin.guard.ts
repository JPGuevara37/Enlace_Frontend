import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../Servicios/api/api.service';

export const adminGuard: CanActivateFn = () => {
  const api = inject(ApiService);
  const router = inject(Router);

  if (api.isloggedIn() && !api.isTokenExpired() && api.isAdmin()) {
    return true;
  }

  router.navigate(['home']);
  return false;
};
