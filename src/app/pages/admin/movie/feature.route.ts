import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./movie.component').then(
          (m) => m.MovieComponent
        ),
    },
  ];