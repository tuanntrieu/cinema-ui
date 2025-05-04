import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./login.component').then(
          (m) => m.LoginComponent
        ),
    },
  ];