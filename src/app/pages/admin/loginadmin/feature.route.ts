import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./loginadmin.component').then(
          (m) => m.LoginadminComponent
        ),
    },
  ];