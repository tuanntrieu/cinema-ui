import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { CustomerService } from '../services/customer/customer.service';
import { error, success } from '../utils/constants';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const customerService = inject(CustomerService);

  const authToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (req.url.includes('refresh-token')) {
    return next(req);
  }

  let authReq = req;
  if (authToken) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
  }
  return next(authReq).pipe(
    catchError((err) => {
      if (err.error.statusCode === 401 && refreshToken) {
        return authService.refreshToken({ refreshToken }).pipe(
          switchMap((res: any) => {
            if (res.status === success) {
              localStorage.setItem('access_token', res.data.accessToken);
              localStorage.setItem('refresh_token', res.data.refreshToken);

              const newAuthReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${res.data.accessToken}`)
              });
              return next(newAuthReq);
            }
            else {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              authService.logout().subscribe({
              
              });
              router.navigate(['/login']).then(
                () => window.location.reload()
              );
              return throwError(() => undefined);
            }

          }), catchError(refreshErr => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            router.navigate(['/login']).then(
              () => window.location.reload()
            );
            return throwError(() => error);
          })
        );
      } else if (err.error.statusCode === 403) {
        localStorage.removeItem('access_token');
        router.navigateByUrl('/access-denied');
      }
      return throwError(() => err);
    })
  );
};
