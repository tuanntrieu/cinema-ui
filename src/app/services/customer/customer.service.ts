import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { baseUrl } from '../../utils/constants';
import { Customer, CustomerRequest, CustomerSearchRequest } from '../../models/customer';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { mapError } from '../../utils/exception';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  #http = inject(HttpClient);
  #url = `${baseUrl}/customer`;
  private currentUserSubject = new BehaviorSubject<Customer | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  updateCustomer(rq: CustomerRequest): Observable<any> {
    return this.#http.patch<any>(`${this.#url}/update`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  updateCustomerCinema(username: string, cinemaId: number): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('cinemaId', cinemaId);
    return this.#http.patch<any>(`${this.#url}/update-cinema`, params).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  getCustomerInfor(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.#http.get<any>(`${this.#url}`, { params }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  extractUsername(): string {
    const token = localStorage.getItem("access_token");
    if (token) {
      const tokenDecode = jwtDecode(token) as { sub: string };
      if (tokenDecode.sub) {
        return tokenDecode.sub;
      }
    }
    return "";
  }

  setCurrentUser(user: Customer | null) {
    if (user)
      this.currentUserSubject.next(user);
  }
  getCurrentUser(): string | null {
    return this.extractUsername();
  }
  getCustomers(rq: CustomerSearchRequest): Observable<any> {
    return this.#http.post<any>(`${this.#url}/get-all`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  lockAccount(id: number): Observable<any> {
    return this.#http.patch<any>(`${this.#url}/lock/${id}`, null).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  unLoockAccount(id: number): Observable<any> {
    return this.#http.patch<any>(`${this.#url}/un-lock/${id}`, null).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

}
