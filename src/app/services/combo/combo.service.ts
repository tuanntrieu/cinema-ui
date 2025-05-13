import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { baseUrl } from '../../utils/constants';
import { catchError, Observable, throwError } from 'rxjs';
import { mapError } from '../../utils/exception';
import { ComboSearchRequest } from '../../models/combo';

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
}
