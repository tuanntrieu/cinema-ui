import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./movie-detail.component').then(
        (m) => m.MovieDetailComponent
      ),
  },
];