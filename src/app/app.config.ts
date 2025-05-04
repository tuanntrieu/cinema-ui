import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthInterceptor } from './auth/auth.interceptor';
import { DatePipe } from '@angular/common';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    provideAnimations(),
    importProvidersFrom(ToastModule),
    { provide: MessageService, useClass: MessageService },
    DatePipe,
    JwtHelperService, 
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS
    }
  ]
};
