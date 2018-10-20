import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { baseUrl, UrlNames } from './url-provider';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';

import { CartAddItemRequestPayload } from '../models/cart-add-item-request-payload';
import { CartRemoveItemRequestPayload } from '../models/cart-remove-item-request-payload';
import { CartGetDetailsRequestPayload } from '../models/cart-get-details-request-payload';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  customerSession: CustomerLoginSession;
  cartId = 0;


  constructor(private http: HttpClient, private store: Store<CustomerLoginSession>) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.customerSession = clsd;
        }
      });
  }

  addToCard(pid: number, qty: number): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CartAddItem,
      this.getAddToCartRequestParams(pid, qty), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          if (res.CartId) {
            this.cartId = res.CartId;
          }
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.processError(error);
        })
      );
  }

  private getAddToCartRequestParams(pid: number, qty: number): CartAddItemRequestPayload {
    if (!this.customerSession) {
      return null;
    }

    return {
      StoreId: this.customerSession.StoreId,
      SessionId: this.customerSession.SessionId,
      UserId: this.customerSession.UserId,
      AppId: this.customerSession.AppId,
      PID: pid,
      Quantity: qty,
      CartId: this.cartId,
      DeviceId: 'A',
      DeviceType: 'A'
    };
  }

  removeFromCart(pid: number): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CartRemoveItem,
      this.getRemoveFromCartRequestParams(pid), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.processError(error);
        })
      );
  }

  private getRemoveFromCartRequestParams(pid: number): CartRemoveItemRequestPayload {
    if (!this.customerSession) {
      return null;
    }

    return {
      StoreId: this.customerSession.StoreId,
      SessionId: this.customerSession.SessionId,
      UserId: this.customerSession.UserId,
      AppId: this.customerSession.AppId,
      PID: pid,
      CartId: this.cartId,
      DeviceId: 'A',
      DeviceType: 'A'
    };
  }

  getCartDetails(): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CartGetDetail,
      this.getCartDetailsRequestParams(), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.processError(error);
        })
      );
  }

  private getCartDetailsRequestParams(): CartGetDetailsRequestPayload {
    if (!this.customerSession) {
      return null;
    }

    return {
      StoreId: this.customerSession.StoreId,
      SessionId: this.customerSession.SessionId,
      UserId: this.customerSession.UserId,
      AppId: this.customerSession.AppId,
      CartId: this.cartId,
      DeviceId: 'A',
      DeviceType: 'A'
    };
  }

  processError(error: any): Observable<any> {
    if (error.status && error.status === 401) {
      return EMPTY;
    }
    return throwError(error);
  }
}
