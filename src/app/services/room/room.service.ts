import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { baseUrl, RoomTypeEnum } from '../../utils/constants';
import { RoomRequest, UpdateRoomSurchargeRequest } from '../../models/room';
import { catchError, Observable, throwError } from 'rxjs';
import { mapError } from '../../utils/exception';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  #http = inject(HttpClient);
  #url = `${baseUrl}/room`;
  constructor() { }
  createRoom(rq: RoomRequest): Observable<any> {
    return this.#http.post(`${this.#url}/create`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  updateRoomType(id: number, roomType: RoomTypeEnum): Observable<any> {
    const params = new HttpParams()
      .set('roomType', roomType)
    return this.#http.patch(`${this.#url}/update-room-type/${id}`, params).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  updateRoomSurcharge(id: number, rq: UpdateRoomSurchargeRequest): Observable<any> {
    return this.#http.patch(`${this.#url}/update-room-type/${id}`, rq).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getRoomOrder(id: number): Observable<any> {
    return this.#http.get(`${this.#url}/get-room-order/${id}`).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  deleteRoom(id: number): Observable<any> {
    return this.#http.delete(`${this.#url}/delete/${id}`).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getAllRoomType(): Observable<any> {
    return this.#http.get(`${this.#url}/get-all-room-types`).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  getRoomDetail(id: number): Observable<any> {
    return this.#http.get(`${this.#url}/${id}`).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }
  validateRoom(id: number): Observable<any> {
    return this.#http.get(`${this.#url}/validate/${id}`).pipe(
      catchError((error) => {
        if (error?.error) {
          return mapError(error.error);
        }
        return throwError(() => error);
      })
    );
  }


}
