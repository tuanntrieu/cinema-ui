import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./movie-type.component').then(
          (m) => m.MovieTypeComponent
        ),
    },
  ];