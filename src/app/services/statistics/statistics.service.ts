import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { baseUrl } from '../../utils/constants';
import { Observable, catchError, throwError } from 'rxjs';
import { mapError } from '../../utils/exception';
import { RevenueChartRequest, RevenueCinemaRequest, RevenueMovieRequest } from '../../models/statistics';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() { }
  #http = inject(HttpClient);
  #url = `${baseUrl}/statistics`;
  countCustomerByDate(date: Date): Observable<any> {
    return this.#http.get(`${this.#url}/count-customer-date`, {
      params: new HttpParams().set("date", date.toISOString().split('T')[0])
    }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  countCustomerByWeek(date: Date): Observable<any> {
    return this.#http.get(`${this.#url}/count-customer-week`, {
      params: new HttpParams().set("date", date.toISOString().split('T')[0])
    }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  countCustomerByMonth(date: Date): Observable<any> {
    return this.#http.get(`${this.#url}/count-customer-month`, {
      params: new HttpParams().set("date", date.toISOString().split('T')[0])
    }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  countTicketByDate(date: Date): Observable<any> {
    return this.#http.get(`${this.#url}/count-ticket-date`, {
      params: new HttpParams().set("date", date.toISOString().split('T')[0])
    }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  countTicketByWeek(date: Date): Observable<any> {
    return this.#http.get(`${this.#url}/count-ticket-week`, {
      params: new HttpParams().set("date", date.toISOString().split('T')[0])
    }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  countTicketByMonth(date: Date): Observable<any> {
    return this.#http.get(`${this.#url}/count-ticket-month`, {
      params: new HttpParams().set("date", date.toISOString().split('T')[0])
    }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  sumTotalByDate(date: Date): Observable<any> {
    return this.#http.get(`${this.#url}/sum-total-date`, {
      params: new HttpParams().set("date", date.toISOString().split('T')[0])
    }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  sumTotalByWeek(date: Date): Observable<any> {
    return this.#http.get(`${this.#url}/sum-total-week`, {
      params: new HttpParams().set("date", date.toISOString().split('T')[0])
    }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  sumTotalByMonth(date: Date): Observable<any> {
    return this.#http.get(`${this.#url}/sum-total-month`, {
      params: new HttpParams().set("date", date.toISOString().split('T')[0])
    }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  getRevenueCinema(rq: RevenueCinemaRequest): Observable<any> {
    return this.#http.post(`${this.#url}/revenue-cinema`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getRevenueMovie(rq: RevenueMovieRequest): Observable<any> {
    return this.#http.post(`${this.#url}/revenue-movie`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getRevenueChartByMonth(rq: RevenueChartRequest): Observable<any> {
    return this.#http.post(`${this.#url}/revenue-by-month`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getRevenueChartByYear(rq: RevenueChartRequest): Observable<any> {
    return this.#http.post(`${this.#url}/revenue-by-year`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  exportMovieExcel(rq: RevenueMovieRequest): Observable<HttpResponse<Blob>> {
    return this.#http.post<Blob>(
      `${this.#url + "/export-movie-excel"}`,
      rq,
      { responseType: 'blob' as 'json', observe: 'response' }
    );
  }
   exportCinemaExcel(rq: RevenueCinemaRequest): Observable<HttpResponse<Blob>> {
    return this.#http.post<Blob>(
      `${this.#url + "/export-cinema-excel"}`,
      rq,
      { responseType: 'blob' as 'json', observe: 'response' }
    );
  }

}
