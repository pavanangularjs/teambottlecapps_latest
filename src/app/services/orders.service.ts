import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { baseUrl, UrlNames } from './url-provider';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';
import { MyOrders } from '../models/my-orders';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  customerSession: CustomerLoginSession;

  constructor(private http: HttpClient, private store: Store<CustomerLoginSession>) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.customerSession = clsd;
        }
      });
  }

  getMyOrdersList(): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.OrderGetList, this.getMyOrdersRequestParams(), { headers: this.headers }).pipe(
      switchMap((res: any) => {
        return of(res);
      }),
      retry(3),
      catchError((error: any, caught: Observable<any>) => {
        return this.processError(error);
      })
    );
  }

  private getMyOrdersRequestParams(): MyOrders {
    if (!this.customerSession) {
      return null;
    }

    return {
      StoreId: this.customerSession.StoreId,
      SessionId: this.customerSession.SessionId,
      UserId: this.customerSession.UserId,
      AppId: this.customerSession.AppId,
      DeviceId: this.customerSession.DeviceId,
      DeviceType: this.customerSession.DeviceType,
      PageNumber: 1,
      PageSize: 10
    };
  }

  processError(error: any): Observable<any> {
    if (error.status && error.status === 401) {
      return EMPTY;
    }
    return throwError(error);
  }
}
