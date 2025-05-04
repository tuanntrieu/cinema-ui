import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./verify-otp.component').then(
          (m) => m.VerifyOtpComponent
        ),
    },
  ];