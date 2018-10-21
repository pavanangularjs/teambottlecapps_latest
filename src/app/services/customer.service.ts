import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { CustomerLoginRequestPayload } from '../models/customer-login-request-payload';
import { CustomerLoginSession } from '../models/customer-login-session';
import { StoreGetHomeRequestPayload } from '../models/store-get-home-request-payload';
import { baseUrl, UrlNames } from './url-provider';
import { BaseRequest } from '../models/base-request';

@Injectable()
export class CustomerService {
  customerSession: CustomerLoginSession;
  private profileDetails: any;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  constructor(private http: HttpClient) {
  }

  loginCustomer( reqParams: CustomerLoginRequestPayload ): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.LoginCustomer, reqParams, {headers : this.headers}).pipe(
      switchMap((res: any) => {
        this.customerSession = res;
        return of(res);
      }),
      retry(3),
      catchError((error: any, caught: Observable<any>) => {
        return this.processError(error);
      })
    );
  }

  getLoginCustomerParams( email?: string, pwd?: string, loginType?: string ) {
    return {
      AppId: 10002,
      AppVersion: '8.5',
      DeviceId: 'W',
      DeviceType: 'W',
      EmailId: email || '',
      LoginType: loginType || 'B',
      Password: pwd || '',
      StoreId: 10002
    };
  }

  getProfileDetails(): Observable<any> {

    if (this.profileDetails) {
      return of(this.profileDetails);
    }
    return this.http.post<any>(baseUrl + UrlNames.ProfileGetDetail, this.getProfileDetailsRequestParams(), { headers: this.headers }).pipe(
      switchMap((res: any) => {
        this.profileDetails = res;
        return of(res);
      }),
      retry(3),
      catchError((error: any, caught: Observable<any>) => {
        return this.processError(error);
      })
    );
  }

  private getProfileDetailsRequestParams(): BaseRequest {
    if (!this.customerSession) {
      return null;
    }

    return {
      StoreId: this.customerSession.StoreId,
      SessionId: this.customerSession.SessionId,
      UserId: this.customerSession.UserId,
      AppId: this.customerSession.AppId,
      DeviceId: this.customerSession.DeviceId,
      DeviceType: this.customerSession.DeviceType
    };
  }

  processError(error: any): Observable<any> {
    if (error.status && error.status === 401) {
      return EMPTY;
    }
    return throwError(error);
  }
}
