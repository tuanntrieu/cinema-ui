import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./change-password.component').then(
          (m) => m.ChangePasswordComponent
        ),
    },
  ];