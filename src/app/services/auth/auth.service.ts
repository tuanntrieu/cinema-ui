import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ChangePassRequest, CommonResponse, ForgetPassRequest, LoginRequest, RegisterRequest, SendOtpRequest, TokenRefRequest, VerifyOtpRequest } from '../../models/auth';
import { baseUrl } from '../../utils/constants';
import { catchError, Observable, of, throwError } from 'rxjs';
import { mapError } from '../../utils/exception';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public jwtHelper: JwtHelperService) { }
  readonly #http = inject(HttpClient);
  #url = `${baseUrl}auth/`;

  key = 'auth';

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  login(rq: LoginRequest): Observable<any> {
    return this.#http.post<any>(`${this.#url}login`, rq)
      .pipe(
        catchError((error) => {
          return mapError(error.error)
        })
      );
  }
  logout(): Observable<any> {
    return this.#http.post<any>(`${this.#url}logout`, {}).pipe(
      catchError((error) => {
        return mapError(error.error)
      })
    );
  }

  register(rq: RegisterRequest): Observable<any> {
    return this.#http.post<any>(`${this.#url}register`, rq).pipe(
      catchError((error) => {
        return mapError(error.error)
      })
    );
  }

  changePassworod(rq: ChangePassRequest): Observable<any> {
    return this.#http.patch<any>(`${this.#url}change-password`, rq).pipe(
      catchError((error) => {
        return mapError(error.error)
      })
    );
  }

  forgetPassword(rq: ForgetPassRequest): Observable<any> {
    return this.#http.patch<any>(`${this.#url}forget-password`, rq).pipe(
      catchError((error) => {
        return mapError(error.error)
      })
    );
  }

  sendOtp(rq: SendOtpRequest): Observable<any> {
    return this.#http.post<any>(`${this.#url}send-otp`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  verifyOtp(rq: VerifyOtpRequest): Observable<any> {
    return this.#http.post<any>(`${this.#url}verify-otp`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  refreshToken(rq: TokenRefRequest): Observable<any> {
    return this.#http.post<any>(`${this.#url}refresh-token`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

}

