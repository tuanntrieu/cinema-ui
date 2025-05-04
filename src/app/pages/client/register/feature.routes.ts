import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./register.component').then(
          (m) => m.RegisterComponent
        ),
    },
  ];