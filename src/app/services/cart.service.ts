import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { baseUrl, UrlNames } from './url-provider';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';

import { CartAddItemRequestPayload } from '../models/cart-add-item-request-payload';
import { CartRemoveItemRequestPayload } from '../models/cart-remove-item-request-payload';
import { CartGetDetailsRequestPayload } from '../models/cart-get-details-request-payload';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  customerSession: CustomerLoginSession;
  cartId = 0;
  cartdetails: any;
  cartItemCount = new Subject<number>();
  cartUpdated = new Subject<any>();


  constructor(private http: HttpClient,
    private store: Store<CustomerLoginSession>,
    private errorHandler: ErrorHandlerService) {
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
            this.cartItemCount.next(res.CartItemCount);
          }
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
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
      DeviceId: this.customerSession.DeviceId,
      DeviceType: this.customerSession.DeviceType
    };
  }

  removeFromCart(pid: number): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CartRemoveItem,
      this.getRemoveFromCartRequestParams(pid), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.cartItemCount.next(res.CartItemCount);
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
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
      DeviceId: this.customerSession.DeviceId,
      DeviceType: this.customerSession.DeviceType
    };
  }

  getCartDetails(): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CartGetDetail,
      this.getCartDetailsRequestParams(), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.cartdetails = res;
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
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
      DeviceId: this.customerSession.DeviceId,
      DeviceType: this.customerSession.DeviceType
    };
  }

  updateCart(data: any): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CartUpdate,
      data, { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.cartdetails = res;
          this.cartUpdated.next();
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  placeOrder(data: any): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.OrderInsert,
      data, { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }
}
