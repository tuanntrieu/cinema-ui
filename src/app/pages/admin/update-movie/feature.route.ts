import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./update-movie.component').then(
          (m) => m.UpdateMovieComponent
        ),
    },
  ];