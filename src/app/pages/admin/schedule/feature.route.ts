import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./schedule.component').then(
          (m) => m.ScheduleComponent
        ),
    },
  ];