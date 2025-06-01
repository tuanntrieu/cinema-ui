import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./customer.component').then(
          (m) => m.CustomerComponent
        ),
    },
  ];