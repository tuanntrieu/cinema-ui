import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./place-order.component').then(
        (m) => m.PlaceOrderComponent
      ),
  },
];