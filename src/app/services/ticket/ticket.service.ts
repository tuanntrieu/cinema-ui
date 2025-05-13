import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { baseUrl } from '../../utils/constants';
import { DataCacheRequest, OrderRequest, TicketRequest } from '../../models/ticket';
import { Observable, catchError, throwError } from 'rxjs';
import { mapError } from '../../utils/exception';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor() { }
  #http = inject(HttpClient);
  #url = `${baseUrl}/ticket`;
  checkOut(rq: OrderRequest): Observable<any> {
    return this.#http.post(`${this.#url}/checkout`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getTicketsByCustomer(rq: TicketRequest): Observable<any> {
    return this.#http.post(`${this.#url}/get-tickets-by-customer`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getPaymentUrl(amount: number): Observable<any> {
    return this.#http.get(`${this.#url}/payment-url`, { params: new HttpParams().set('amount', amount.toString()) })
      .pipe(
        catchError((error) => {
          if (error?.error) {
            return mapError(error.error);
          }
          return throwError(() => error);
        })
      );
  }
  handleReturn(vnp_SecureHash: string, params: HttpParams): Observable<any> {
    params.set("vnp_SecureHash", vnp_SecureHash)
    return this.#http.get(`${this.#url}/handle-return`, { params }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  saveDataTmp(rq: DataCacheRequest): Observable<any> {
    return this.#http.post(`${this.#url}/save-data-tmp`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  readDataTmp(vnp_TxnRef: string): Observable<any> {
    return this.#http.get(`${this.#url}/read-data-tmp`, { params: new HttpParams().set('vnp_TxnRef', vnp_TxnRef.toString()) }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  existById(id: string): Observable<any> {
    return this.#http.get(`${this.#url}/exist-by-id`, { params: new HttpParams().set('vnp_TxnRef', id.toString()) }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getTicketById(id: string): Observable<any> {
    return this.#http.get(`${this.#url}/${id}`).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }


}
