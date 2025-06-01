import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('./schedule-detail.component').then(
          (m) => m.ScheduleDetailComponent
        ),
    },
  ];