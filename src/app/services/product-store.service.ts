import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { baseUrl, UrlNames } from './url-provider';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';
import { StoreGetHome } from '../state/product-store/product-store.action';
import { ProductGetListRequestPayload } from '../models/product-get-list-request-payload';
import { ProductGetDetailsRequestPayload } from '../models/product-get-details-request-payload';
import { EventGetDetailsRequestPayload } from '../models/event-get-details-request-payload';
import { FavoriteProductUpdateRequestPayload } from '../models/favorite-product-update-payload';
import { AddProductReview } from '../models/add-product-review';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { BaseRequest } from '../models/base-request';

@Injectable()
export class ProductStoreService {
    headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    customerSession: CustomerLoginSession;
    couponsList: any;

    constructor(private http: HttpClient, private store: Store<CustomerLoginSession>,
        private errorHandler: ErrorHandlerService) {
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
                return this.errorHandler.processError(error);
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
            AppId: this.customerSession.AppId
        };
    }

    productGetList(reqParams: ProductGetListRequestPayload): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.ProductGetList, reqParams, { headers: this.headers }).pipe(
            switchMap((res: any) => {
                return of(res);
            }),
            retry(3),
            catchError((error: any, caught: Observable<any>) => {
                return this.errorHandler.processError(error);
            })
        );
    }

    getProductGetListParams({ pageSize = 12, pageNumber = 1, isClub = 0,
        categoryId = '1,2,3,4', sizeId = '',
        typeId = '', varietalId = 0, countryId = '',
        regionId = '', isFavorite = 0, isFeatured = 0,
        maxPrice = 0, minPrice = 0, keyWord = ''
    }:
        {
            pageSize?: number, pageNumber?: number, isClub?: number,
            categoryId?: string, sizeId?: string,
            typeId?: string, varietalId?: number, countryId?: string,
            regionId?: string, isFavorite?: number, isFeatured?: number,
            maxPrice?: number, minPrice?: number, keyWord?: string
        } = {}) {

        if (!this.customerSession) {
            return null;
        }
        return {
            StoreId: this.customerSession.StoreId,
            AppId: this.customerSession.AppId,
            PageSize: pageSize,
            PageNumber: pageNumber,
            IsClub: isClub,
            CategoryId: categoryId,
            SessionId: this.customerSession.SessionId,
            UserId: this.customerSession.UserId,
            SizeId: sizeId,
            TypeId: typeId,
            VarietalId: varietalId,
            CountryId: countryId,
            RegionId: regionId,
            IsFavorite: isFavorite,
            IsFeatured: isFeatured,
            MaxPrice: maxPrice,
            MinPrice: minPrice,
            KeyWord: keyWord,
            DeviceId: this.customerSession.DeviceId,
            DeviceType: this.customerSession.DeviceType
        };
    }

    productGetDetails(reqParams: ProductGetDetailsRequestPayload): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.ProductGetDetails, reqParams, { headers: this.headers }).pipe(
            switchMap((res: any) => {
                return of(res);
            }),
            retry(3),
            catchError((error: any, caught: Observable<any>) => {
                return this.errorHandler.processError(error);
            })
        );
    }

    getProductGetDetailsParams(pid: number): ProductGetDetailsRequestPayload {
        if (!this.customerSession) {
            return null;
        }
        return {
            StoreId: this.customerSession.StoreId,
            UserId: this.customerSession.UserId,
            SessionId: this.customerSession.SessionId,
            AppId: this.customerSession.AppId,
            PID: pid
        };
    }

    eventGetDetails(reqParams: EventGetDetailsRequestPayload): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.EventGetDetails, reqParams, { headers: this.headers }).pipe(
            switchMap((res: any) => {
                return of(res);
            }),
            retry(3),
            catchError((error: any, caught: Observable<any>) => {
                return this.errorHandler.processError(error);
            })
        );
    }

    getEventGetDetailsParams(eid: number): EventGetDetailsRequestPayload {
        if (!this.customerSession) {
            return null;
        }
        return {
            StoreId: this.customerSession.StoreId,
            UserId: this.customerSession.UserId,
            SessionId: this.customerSession.SessionId,
            AppId: this.customerSession.AppId,
            EventID: eid
        };
    }

    favoriteProductUpdate(productId: number, favStatus: boolean): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.FavoriteProductUpdate, this.getFavoriteUpdateObject(productId, favStatus));
    }

    getFavoriteUpdateObject(productId: number, favStatus: boolean): FavoriteProductUpdateRequestPayload {
        if (!this.customerSession) {
            return null;
        }
        return {
            StoreId: this.customerSession.StoreId,
            UserId: this.customerSession.UserId,
            SessionId: this.customerSession.SessionId,
            AppId: this.customerSession.AppId,
            PID: productId,
            FavoriteStatus: favStatus
        };
    }

    addProductReview(productId: number, reviewTitle: string, reviewDescription: string, rating: number): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.ReviewRatingInsert,
            this.getProductReviewParams(productId, reviewTitle, reviewDescription, rating));
    }

    getProductReviewParams(productId: number, reviewTitle: string, reviewDescription: string, rating: number): AddProductReview {
        if (!this.customerSession) {
            return null;
        }
        return {
            StoreId: this.customerSession.StoreId,
            UserId: this.customerSession.UserId,
            SessionId: this.customerSession.SessionId,
            AppId: this.customerSession.AppId,
            PID: productId,
            ReviewTitle: reviewTitle,
            ReviewDescription: reviewDescription,
            ReviewRating: rating,
            DeviceId: 'W',
            DeviceType: 'W'
        };
    }

    couponsGetDetails(): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.CouponGetList,
            this.getProfileDetailsRequestParams(), { headers: this.headers }).pipe(
            switchMap((res: any) => {
                this.couponsList = res;
                return of(res);
            }),
            retry(3),
            catchError((error: any, caught: Observable<any>) => {
                return this.errorHandler.processError(error);
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
}
