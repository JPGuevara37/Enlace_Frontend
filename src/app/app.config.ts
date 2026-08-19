import { ApplicationConfig, APP_INITIALIZER, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { RuntimeConfigService } from './config/runtime-config.service';
import { authInterceptor } from './Servicios/api/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const config = inject(RuntimeConfigService);
        return () => config.load();
      },
      multi: true,
    },
  ],
};
