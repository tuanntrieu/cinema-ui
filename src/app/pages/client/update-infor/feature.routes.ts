import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./update-infor.component').then(
          (m) => m.UpdateInforComponent
        ),
    },
  ];