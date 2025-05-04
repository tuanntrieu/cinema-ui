import { Route } from "@angular/router";

export const PageRouter: Route[] = [
    {
        path: '',
        loadChildren: () =>
            import('./client/client.routes').then((m) => m.ClientRoute),
    },
    {
        path: '',
        loadChildren: () =>
            import('./error/error.routes').then((m) => m.ErrorRoute),
    }
];
