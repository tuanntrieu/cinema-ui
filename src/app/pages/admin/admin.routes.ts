import { Route } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';

export const AdminRoute: Route[] = [
    {
        path: 'admin',
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
            },
            {
                path: '',
                loadChildren: () =>
                    import('./dashboard/feature.route').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Dashboard',
            },
            {
                path: 'movie-type',
                loadChildren: () =>
                    import('./movie-type/feature.route').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Dashboard',
            }
            ,
            {
                path: 'food',
                loadChildren: () =>
                    import('./food/feature.route').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Dashboard',
            }
        ],
        title: 'Trang chủ',
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_ADMIN'] }
    }
    ,
    {
        path: 'admin/login',
        loadChildren: () =>
            import('./loginadmin/feature.route').then(
                (m) => m.featureModuleRoutes
            ),
        title: 'Đăng nhập admin',
    },
]