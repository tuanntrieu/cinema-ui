import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { MovieTypeRequest, MovieTypeSearchRequest } from '../../models/movie';
import { baseUrl } from '../../utils/constants';
import { mapError } from '../../utils/exception';
import { FoodRequest } from '../../models/combo';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  #http = inject(HttpClient);
  #url = `${baseUrl}/food`;
  constructor() { }
  createFood(name: string): Observable<any> {
    return this.#http.post(`${this.#url}/create`,null, { params: new HttpParams().set("name", name) }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getAllFood(): Observable<any> {
    return this.#http.get(`${this.#url}/get-all`).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getAllFoodPage(rq: FoodRequest): Observable<any> {
    return this.#http.post(`${this.#url}/get-all-page`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  deleteFood(id: number): Observable<any> {
    return this.#http.delete(`${this.#url}/delete/${id}`).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
}
