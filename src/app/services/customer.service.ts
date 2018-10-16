import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import * as global from '../global';
import { CustomerLoginRequestPayload } from '../models/customer-login-request-payload';
import { StoreGetHomeRequestPayload } from '../models/store-get-home-request-payload';
import { UrlNames } from './url-provider';

@Injectable()
export class CustomerService {
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  constructor(private http: HttpClient) {
  }

  loginCustomer( reqParams: CustomerLoginRequestPayload ): Observable<any> {
    return this.http.post<any>(global.baseUrl + UrlNames.LoginCustomer, reqParams, {headers : this.headers}).pipe(
      switchMap((res: any) => {
        return of(res);
      }),
      retry(3),
      catchError((error: any, caught: Observable<any>) => {
        return this.processError(error);
      })
    );
  }

  getLoginCustomerParams( email?: string, pwd?: string ) {
    return {
      AppId: 10002,
      AppVersion: '8.5',
      DeviceId: 'W',
      DeviceType: 'W',
      EmailId: email || '',
      LoginType: 'B',
      Password: pwd || '',
      StoreId: 10002
    };
  }
  processError(error: any): Observable<any> {
    if (error.status && error.status === 401) {
      return EMPTY;
    }
    return throwError(error);
  }
}
