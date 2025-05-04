import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./forget-password.component').then(
          (m) => m.ForgetPasswordComponent
        ),
    },
  ];