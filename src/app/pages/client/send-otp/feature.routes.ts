import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./send-otp.component').then(
          (m) => m.SendOtpComponent
        ),
    },
  ];