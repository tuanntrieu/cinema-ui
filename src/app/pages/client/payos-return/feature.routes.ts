import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./payos-return.component').then(
        (m) => m.PayosReturnComponent
      ),
  },
];