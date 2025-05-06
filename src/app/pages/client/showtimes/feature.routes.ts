import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./showtimes.component').then(
          (m) => m.ShowtimesComponent
        )
    },
  ];