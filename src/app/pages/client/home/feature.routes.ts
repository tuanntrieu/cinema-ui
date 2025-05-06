import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./home.component').then(
          (m) => m.HomeComponent
        ),
    },
  ];