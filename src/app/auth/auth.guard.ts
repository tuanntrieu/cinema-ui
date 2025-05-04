import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { jwtDecode } from "jwt-decode";


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

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRoles: string[] = route.data['roles'] || [];
        const token = localStorage.getItem('access_token');
        console.log(expectedRoles);

        if (!token || !this.#auth.isAuthenticated()) {
            this.#router.navigate(['/login']);
            return false;
        }

        try {
            const decoded: JwtPayload = jwtDecode(token);
            const userRole = decoded.auth;
            console.log(userRole);
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
