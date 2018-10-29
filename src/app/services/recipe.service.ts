import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { baseUrl, UrlNames } from './url-provider';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';

import { RecipeGetListRequestPayload } from '../models/recipe-get-list-request-payload';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  customerSession: CustomerLoginSession;
  recipesList: any;
  selectedRecipe: any;

  constructor(private http: HttpClient, private store: Store<CustomerLoginSession>) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.customerSession = clsd;
        }
      });
  }

  getRecipeList(): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.RecipeGetList, this.getRecipeRequestParams(), { headers: this.headers }).pipe(
      switchMap((res: any) => {
        this.recipesList = res;
        return of(res);
      }),
      retry(3),
      catchError((error: any, caught: Observable<any>) => {
        return this.processError(error);
      })
    );
  }

  private getRecipeRequestParams(): RecipeGetListRequestPayload {
    if (!this.customerSession) {
      return null;
    }

    return {
      StoreId: this.customerSession.StoreId,
      SessionId: this.customerSession.SessionId,
      UserId: this.customerSession.UserId,
      AppId: this.customerSession.AppId,
      PageNumber: 1,
      PageSize: 12
    };
  }

  processError(error: any): Observable<any> {
    if (error.status && error.status === 401) {
      return EMPTY;
    }
    return throwError(error);
  }
}
