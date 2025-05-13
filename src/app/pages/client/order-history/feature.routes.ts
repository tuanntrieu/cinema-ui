import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./order-history.component').then(
        (m) => m.OrderHistoryComponent
      ),
  },
];