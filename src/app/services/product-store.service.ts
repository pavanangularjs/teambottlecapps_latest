import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { CustomerService } from './customer.service';
import { baseUrl, UrlNames } from './url-provider';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';
import { StoreGetHome } from '../state/product-store/product-store.action';
import { ProductGetListRequestPayload } from '../models/product-get-list-request-payload';

@Injectable()
export class ProductStoreService {
    headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
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
            StoreId: this.customerSession.StoreId,
            SessionId: this.customerSession.SessionId,
            UserId: this.customerSession.UserId,
            AppId: this.customerSession.AppId,
            IsFeatureProduct: true
        };
    }

    productGetList(reqParams: ProductGetListRequestPayload): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.ProductGetList, reqParams, { headers: this.headers }).pipe(
            switchMap((res: any) => {
                return of(res);
            }),
            retry(3),
            catchError((error: any, caught: Observable<any>) => {
                return this.processError(error);
            })
        );
    }

    getProductGetListParams({ pageSize = 12, pageNumber = 1, isClub = 0, keyWord = '',
        categoryId = 0, regionId = 0, typeId = 0, varitalId = 0, countryId = 0 }:
        {
            pageSize?: number, pageNumber?: number, isClub?: number, keyWord?: string,
            categoryId?: number, regionId?: number, typeId?: number, varitalId?: number, countryId?: number
        } = {}) {

        return {
            StoreId: this.customerSession.StoreId,
            PageSize: pageSize,
            PageNumber: pageNumber,
            IsClub: isClub,
            KeyWord: keyWord,
            CategoryId: categoryId,
            RegionId: regionId,
            TypeId: typeId,
            VaritalId: varitalId,
            CountryId: countryId,
            SessionId: this.customerSession.SessionId,
            UserId: this.customerSession.UserId,
            AppId: this.customerSession.AppId
        };
    }

    processError(error: any): Observable<any> {
        if (error.status && error.status === 401) {
            return EMPTY;
        }
        return throwError(error);
    }
}
