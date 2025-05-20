import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./food.component').then(
          (m) => m.FoodComponent
        ),
    },
  ];