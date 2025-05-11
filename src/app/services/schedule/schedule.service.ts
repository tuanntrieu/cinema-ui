import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { baseUrl } from '../../utils/constants';
import { ScheduleForMoiveByDateRequest, ScheduleRequest, ScheduleSearchByCinemaRequest, ScheduleSearchByRoomRequest } from '../../models/schedule';
import { Observable, catchError, throwError } from 'rxjs';
import { mapError } from '../../utils/exception';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  #http = inject(HttpClient);
  #url = `${baseUrl}/schedule`;
  constructor() { }

  createSchedule(rq: ScheduleRequest): Observable<any> {
    return this.#http.post(`${this.#url}/create`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  deleteSchedule(id: number): Observable<any> {
    return this.#http.delete(`${this.#url}/delete/${{ id }}`).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getScheduleForMovieByCinema(rq: ScheduleSearchByCinemaRequest): Observable<any> {
    return this.#http.post(`${this.#url}/get-by-cinema`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  getScheduleForMovieByDate(rq: ScheduleForMoiveByDateRequest): Observable<any> {
    return this.#http.post(`${this.#url}/get-by-date`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getScheduleForRoom(rq: ScheduleSearchByRoomRequest): Observable<any> {
    return this.#http.post(`${this.#url}/get-by-room`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

}
