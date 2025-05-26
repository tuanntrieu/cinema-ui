import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { baseUrl } from '../../utils/constants';
import { Observable, catchError, throwError } from 'rxjs';
import { mapError } from '../../utils/exception';
import { MovieRequest, MovieSearchRequest } from '../../models/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  #http = inject(HttpClient);
  #url = `${baseUrl}/movie`;
  constructor() { }

  getMoviesByDate(rq: MovieSearchRequest): Observable<any> {
    return this.#http.post(`${this.#url}/search-by-date`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getAllMovie(rq: MovieSearchRequest): Observable<any> {
    return this.#http.post(`${this.#url}/get-all`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getMoviesCoomingSoon(rq: MovieSearchRequest): Observable<any> {
    return this.#http.post(`${this.#url}/search-coming-soon`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  getMovieDetail(id: number): Observable<any> {
    return this.#http.get(`${this.#url}/${id}`).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  createMovie(request: MovieRequest, file: File): Observable<any> {
    const formData = new FormData();
    Object.entries(request).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v.toString()));
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString().split('T')[0]);
      } else {
        formData.append(key, value.toString());
      }
    });
    formData.append('image', file);

    return this.#http.post(`${this.#url}/create`, formData).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }


}
