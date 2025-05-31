import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./update-cinema.component').then(
          (m) => m.UpdateCinemaComponent
        ),
    },
  ];