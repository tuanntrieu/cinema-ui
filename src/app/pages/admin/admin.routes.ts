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
                title: 'Quản lý thể loại phim ',
            }
            ,
            {
                path: 'food',
                loadChildren: () =>
                    import('./food/feature.route').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Quản lý đồ ăn ',
            },
            {
                path: 'price',
                loadChildren: () =>
                    import('./price/feature.route').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Quản lý giá vé ',
            }
            ,
            {
                path: 'movie',
                loadChildren: () =>
                    import('./movie/feature.route').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Quản lý phim ',
            }
            ,
            {
                path: 'cinema',
                loadChildren: () =>
                    import('./cinema/feature.route').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Quản lý rạp phim',
            },
            {
                path: 'schedule',
                loadChildren: () =>
                    import('./schedule/feature.route').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Quản lý lịch chiếu ',
            },
            {
                path: 'combo',
                loadChildren: () =>
                    import('./combo/feature.route').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Quản lý combo',
            },
            {
                path: 'create-movie',
                loadChildren: () =>
                    import('./create-movie/feature.route').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Thêm phim ',
            }
            ,
            {
                path: 'update-movie/:id',
                loadChildren: () =>
                    import('./update-movie/feature.route').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Chỉnh sửa phim ',
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