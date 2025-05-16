import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./not-found.component').then(
          (m) => m.NotFoundComponent
        ),
    },
  ];