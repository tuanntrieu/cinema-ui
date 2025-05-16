import { Route } from '@angular/router';

export const ErrorRoute: Route[] = [
    {
        path: 'access-denied',
        loadChildren: () =>
            import('./access-denied/feature.routes').then(
                (m) => m.featureModuleRoutes
            ),
        title: 'Không có quyền truy cập',
    },
      {
        path: '**',
        loadChildren: () =>
            import('./not-found/feature.routes').then(
                (m) => m.featureModuleRoutes
            ),
        title: 'Không tìm thấy trang',
    }
]