import { Route } from '@angular/router';

import { AuthGuard } from '../../guard/auth.guard';

export const ClientRoute: Route[] = [
    {
        path: '',
        loadComponent: () =>
            import('./client.component').then(
                (m) => m.ClientComponent
            ),
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./home/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Cinemas',
            },
            {
                path: 'movies',
                loadChildren: () =>
                    import('./home/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Cinemas',
            },
            {
                path: 'login',
                loadChildren: () =>
                    import('./login/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Đăng nhập',
            },
            {
                path: 'register',
                loadChildren: () =>
                    import('./register/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Đăng ký',
            },
            {
                path: 'change-password',
                loadChildren: () =>
                    import('./change-password/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Đổi mật khẩu',
                canActivate: [AuthGuard],
                data: { roles: ['ROLE_USER'] }
            },
            {
                path: 'update-infor',
                loadChildren: () =>
                    import('./update-infor/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Thay đổi thông tin',
                canActivate: [AuthGuard],
                data: { roles: ['ROLE_USER'] }
            },
            {
                path: 'forget-password',
                loadChildren: () =>
                    import('./forget-password/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Quên mật khẩu',
            },
            {
                path: 'send-otp',
                loadChildren: () =>
                    import('./send-otp/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Quên mật khẩu',
            }
            ,
            {
                path: 'verify-otp',
                loadChildren: () =>
                    import('./verify-otp/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Quên mật khẩu',
            },
            {
                path: 'showtimes',
                loadChildren: () =>
                    import('./showtimes/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Lịch chiếu theo rạp',
            },
            {
                path: 'movie/:id',
                loadChildren: () =>
                    import('./movie-detail/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Chi tiết phim',
            },
            {
                path: 'place-order/:id',
                loadChildren: () =>
                    import('./place-order/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Đặt vé',
                canActivate: [AuthGuard],
                data: { roles: ['ROLE_USER'] }
            },
            {
                path: 'payment/result',
                loadChildren: () =>
                    import('./payment/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Kết quả',
                canActivate: [AuthGuard],
                data: { roles: ['ROLE_USER'] }
            }
            ,
            {
                path: 'order-history',
                loadChildren: () =>
                    import('./order-history/feature.routes').then(
                        (m) => m.featureModuleRoutes
                    ),
                title: 'Lịch sử thanh toán',
                canActivate: [AuthGuard],
                data: { roles: ['ROLE_USER'] }
            }
        ],
        title: 'Trang chủ',
    }
]