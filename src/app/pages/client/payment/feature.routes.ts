import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./payment.component').then(
        (m) => m.PaymentComponent
      ),
  },
];