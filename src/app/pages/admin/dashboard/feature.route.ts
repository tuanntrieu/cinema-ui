import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./dashboard.component').then(
          (m) => m.DashboardComponent
        ),
    },
  ];