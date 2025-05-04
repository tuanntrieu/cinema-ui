import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./access-denied.component').then(
          (m) => m.AccessDeniedComponent
        ),
    },
  ];