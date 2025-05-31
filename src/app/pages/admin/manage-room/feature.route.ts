import { Route } from '@angular/router';

export const featureModuleRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./manage-room.component').then(
        (m) => m.ManageRoomComponent
      ),
  },
];