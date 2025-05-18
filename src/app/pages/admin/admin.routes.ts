import { Route } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';

export const AdminRoute: Route[] = [
    {
        path: '',
        loadComponent: () =>
            import('./admin.component').then(
                (m) => m.AdminComponent
            ),
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./dashboard/feature.route').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Dashboard',
            }
        ],
        title: 'Trang chủ',
    }
]