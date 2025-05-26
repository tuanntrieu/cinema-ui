import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { baseUrl } from '../../utils/constants';
import { catchError, Observable, throwError } from 'rxjs';
import { mapError } from '../../utils/exception';
import { CinemaSearchRequest } from '../../models/cinema';


@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  #http = inject(HttpClient);
  #url = `${baseUrl}/cinema/`;

  getAllCinema(): Observable<any> {
    return this.#http.get(`${this.#url}load-all-cinema`).pipe(

      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getAllCinemaPage(rq: CinemaSearchRequest): Observable<any> {
    return this.#http.post(`${this.#url}get-all`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getAllProvince(): Observable<any> {
    return this.#http.get(`${this.#url}province`).pipe(

      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })

    );
  }
  getCinemaByProvince(province: string) {
    const params = new HttpParams()
      .set('province', province)
    return this.#http.get<any>(`${this.#url}load-by-province`, { params }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
}