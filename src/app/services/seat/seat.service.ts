import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UpdateSeatPriceRequest, UpdateSeatStatusRequest, UpdateSeatTypeRequest } from '../../models/seat';
import { baseUrl } from '../../utils/constants';
import { mapError } from '../../utils/exception';

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  constructor() { }
  #http = inject(HttpClient);
  #url = `${baseUrl}/seat`;
  updateSeatStatus(rq: UpdateSeatStatusRequest): Observable<any> {
    return this.#http.patch(`${this.#url}/update-status`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  holdSeat(rq: UpdateSeatStatusRequest): Observable<any> {
    return this.#http.patch(`${this.#url}/hold-seat`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  unHoldSeat(rq: UpdateSeatStatusRequest): Observable<any> {
    return this.#http.patch(`${this.#url}/unhold-seat`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  validateSeat(scheduleId: number, seatIds: number[]): Observable<any> {
    let params = new HttpParams();
    seatIds.forEach(id => {
      params = params.append('seatId', id.toString());
    });

    return this.#http.get(`${this.#url}/validate-seat/${scheduleId}`, { params }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getAllSeatPrice(): Observable<any> {
    return this.#http.get(`${this.#url}/get-all-seat-price`).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  updateSeatPrice(rq: UpdateSeatPriceRequest): Observable<any> {
    return this.#http.patch(`${this.#url}/update-price`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  maintainSeat(seatIds: number[]): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        seatIds: seatIds.map(id => id.toString())
      }
    });
    return this.#http.patch(`${this.#url}/maintain`, null, { params }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  unMaintainSeat(seatIds: number[]): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        seatIds: seatIds.map(id => id.toString())
      }
    });
    return this.#http.patch(`${this.#url}/un-maintain`, null, { params }).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  updateStandardSeats(rq:UpdateSeatTypeRequest): Observable<any> {
    return this.#http.patch(`${this.#url}/update-standard`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
    updateVipSeats(rq:UpdateSeatTypeRequest): Observable<any> {
    return this.#http.patch(`${this.#url}/update-vip`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

    updateCoupleSeats(rq:UpdateSeatTypeRequest): Observable<any> {
    return this.#http.patch(`${this.#url}/update-couple`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }


}
