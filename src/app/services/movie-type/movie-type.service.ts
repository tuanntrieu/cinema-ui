import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { baseUrl } from '../../utils/constants';
import { MovieTypeRequest, MovieTypeSearchRequest } from '../../models/movie';
import { Observable, catchError, throwError } from 'rxjs';
import { mapError } from '../../utils/exception';

@Injectable({
  providedIn: 'root'
})
export class MovieTypeService {
  #http = inject(HttpClient);
  #url = `${baseUrl}/movie-type`;
  constructor() { }
  createMovieType(rq: MovieTypeRequest): Observable<any> {
    return this.#http.post(`${this.#url}/create`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  updateMovieType(id: number, rq: MovieTypeRequest): Observable<any> {
    return this.#http.patch(`${this.#url}/update/${id}`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getAllMovieType(): Observable<any> {
    return this.#http.get(`${this.#url}/get-all`).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getAllMovieTypePage(rq: MovieTypeSearchRequest): Observable<any> {
    return this.#http.post(`${this.#url}/get-all-page`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  deleteMovieType(id:number): Observable<any> {
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
