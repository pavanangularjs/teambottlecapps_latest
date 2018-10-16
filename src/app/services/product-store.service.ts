import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { CustomerService } from './customer.service';
import { StoreGetHomeRequestPayload } from '../models/store-get-home-request-payload';
import { baseUrl, UrlNames } from './url-provider';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';
import { StoreGetHome } from '../state/product-store/product-store.action';

@Injectable()
export class ProductStoreService {

    customerSession: CustomerLoginSession;

    constructor(private http: HttpClient, private store: Store<CustomerLoginSession>, private customerService: CustomerService) {
        this.store.select(CustomerSelectors.customerLoginSessionData)
            .subscribe(clsd => {
                if (clsd) {
                    this.customerSession = clsd;
                    this.store.dispatch(new StoreGetHome());
                }
            });
    }

    getStoreHome(): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.GetStoreHome, this.getStoreObject()).pipe(
            switchMap((res: any) => {
                return of(res);
            }),
            retry(3),
            catchError((error: any, caught: Observable<any>) => {
                return this.processError(error);
            })
        );
    }

    private getStoreObject(): any {
        if (!this.customerSession) {
            return null;
        }

        return {
            storeId: this.customerSession.StoreId,
            sessionId: this.customerSession.SessionId,
            userId: this.customerSession.UserId,
            appId: this.customerSession.AppId,
            isFeatureProduct: true
        };
    }

    processError(error: any): Observable<any> {
        if (error.status && error.status === 401) {
            return EMPTY;
        }
        return throwError(error);
    }
}
