import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { jwtDecode } from "jwt-decode";
import { error, success } from "../utils/constants";
import { ToastService } from "../services/toast/toast.service";


interface JwtPayload {
    auth: string;
    exp?: number;
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    #router = inject(Router);
    #auth = inject(AuthService);
    #toast = inject(ToastService);
    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRoles: string[] = route.data['roles'] || [];
        const token = localStorage.getItem('access_token');
        if (!this.#auth.isAuthenticated) {
            this.#auth.refreshToken({ refreshToken: token ?? '' }).subscribe({
                next: (res) => {
                    if (res.status === success) {
                        localStorage.setItem('access_token', res.data.accessToken);
                        localStorage.setItem('refresh_token', res.data.refreshToken);
                        return true;
                    } else {
                        this.#router.navigate(['/login']);
                        return false;
                    }
                },
                error: (error) => {
                    this.#toast.error(error)
                    this.#router.navigate(['/login']);
                    return false;

                }
            });
        }
        if (!token) {
            this.#router.navigate(['/login']);
            return false;
        }
        try {
            const decoded: JwtPayload = jwtDecode(token);
            const userRole = decoded.auth;
            if (expectedRoles.length === 0) {
                return true;
            }
            if (!expectedRoles.includes(userRole)) {
                this.#auth.logout().subscribe();
                this.#router.navigate(['/access-denied']);
                return false;
            }
            return true;
        } catch (err) {
            this.#router.navigate(['/login']);
            return false;
        }
    }
}
