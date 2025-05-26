import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./combo.component').then(
          (m) => m.ComboComponent                                     
        ),            
    },
  ];