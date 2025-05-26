import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./cinema.component').then(
          (m) => m.CinemaComponent
        ),
    },
  ];