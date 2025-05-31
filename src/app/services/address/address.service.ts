import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly url = '/api/provinces';


  constructor(private http: HttpClient) { }
  getProvinces(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/p/`);
  }
  getDistricts(code: number): Observable<any[]> {
    return this.http.get<any>(`${this.url}/p/${code}?depth=2`).pipe(map(res => res.districts));
  }
  getWards(code: number): Observable<any[]> {
    return this.http.get<any>(`${this.url}/d/${code}?depth=2`).pipe(map(res => res.wards));
  }

}
