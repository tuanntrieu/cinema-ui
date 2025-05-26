import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { baseUrl } from '../../utils/constants';
import { catchError, Observable, throwError } from 'rxjs';
import { mapError } from '../../utils/exception';
import { ComboRequest, ComboSearchRequest } from '../../models/combo';

@Injectable({
  providedIn: 'root'
})
export class ComboService {

  constructor() { }
  #http = inject(HttpClient);
  #url = `${baseUrl}/combo`;
  getCombo(rq: ComboSearchRequest): Observable<any> {
    return this.#http.post<any>(`${this.#url}/get-all`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  createCombo(rq: ComboRequest, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(rq));
    if (file) {
      formData.append('file', file);
    }
    return this.#http.post<any>(`${this.#url}/create`, formData).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  deleteCombo(id:number): Observable<any> {
    return this.#http.delete<any>(`${this.#url}/delete/${id}`).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
}
