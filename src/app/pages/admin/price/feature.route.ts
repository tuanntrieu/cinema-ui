import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./price.component').then(
          (m) => m.PriceComponent
        ),
    },
  ];