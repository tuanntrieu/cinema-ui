import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./create-movie.component').then(
          (m) => m.CreateMovieComponent
        ),
    },
  ];