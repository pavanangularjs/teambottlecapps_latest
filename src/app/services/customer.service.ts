import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { CustomerLoginRequestPayload } from '../models/customer-login-request-payload';
import { CustomerLoginSession } from '../models/customer-login-session';
import { StoreGetHomeRequestPayload } from '../models/store-get-home-request-payload';
import { baseUrl, UrlNames } from './url-provider';
import { BaseRequest } from '../models/base-request';
import { AddressInsert } from '../models/address-insert';
import { AddressUpdate } from '../models/address-update';
import { AddressDelete } from '../models/address-delete';
import { CustomerProfileUpdate } from '../models/customer-profile-update';
import { CustomerPaymentInsert } from '../models/customer-payment-insert';
import { AuthService } from '../auth.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { CustomerLogin } from '../state/customer/customer.action';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ProgressBarService } from '../shared/services/progress-bar.service';
import { AppConfigService } from '../app-config.service';

@Injectable()
export class CustomerService {
  customerSession: CustomerLoginSession;
  private profileDetails: any;
  customerAddressList: any;
  customerPaymentMethodGetList: any;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private http: HttpClient,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService,
    private store: Store<CustomerLoginSession>,
    private toastr: ToastrService,
    private progressBarService: ProgressBarService,
    private appConfig: AppConfigService) {
      /* if (this.appConfig.deviceID === '') {
        this.appConfig.deviceID = Math.random().toString(36).substring(2);
      } */
  }

  loginCustomer(reqParams: CustomerLoginRequestPayload): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.LoginCustomer, reqParams, { headers: this.headers }).pipe(
      switchMap((res: any) => {
        if ((res.ErrorDetail && res.ErrorDetail !== '') || (res.ErrorMessage && res.ErrorMessage !== '')) {
          this.toastr.error(res.ErrorDetail);
          this.progressBarService.hide();

          const demail = localStorage.getItem('email');
          const dpass = localStorage.getItem('password');

          if (demail && dpass) {
            localStorage.removeItem('email');
            localStorage.removeItem('password');
            this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams()));
          }
        } else if (res.SessionId && res.SessionId !== '') {
          this.customerSession = res;
          this.authService.setSessionToken(res.SessionId);
          this.authService.setUserId(res.UserId);
          return of(res);
        } else {
          this.toastr.error('Internal Server Error.');
          this.progressBarService.hide();
          return EMPTY;
        }
      }),
      retry(3),
      catchError((error: any, caught: Observable<any>) => {
        return this.errorHandler.processError(error);
      })
    );
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

  updateCustomerProfile(profile: CustomerProfileUpdate ): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CustomerProfileUpdate,
      this.updateProfileDetails(profile), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.profileDetails = res;
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  UploadImage(image: any): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.UploadImage,
      {path: image}, { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getCustomerAddressList(): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CustomerAddressGetList,
      this.getProfileDetailsRequestParams(), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.customerAddressList = res;
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  AddNewAddress(address: AddressInsert): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.AddressInsert,
      this.updateProfileDetails(address), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.customerAddressList = null;
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  UpdateAddress(address: AddressUpdate): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.AddressUpdate,
      this.updateProfileDetails(address), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.customerAddressList = null;
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  DeleteAddress(addressId: number): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.AddressDelete,
      this.getDeleteAddressParams(addressId), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.customerAddressList = null;
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getDeleteAddressParams(addressId: number): AddressDelete {
    return {
      StoreId: this.customerSession.StoreId,
      SessionId: this.customerSession.SessionId,
      UserId: this.customerSession.UserId,
      AppId: this.customerSession.AppId,
      DeviceId: this.customerSession.DeviceId,
      DeviceType: this.customerSession.DeviceType,
      AddressId: addressId
    };
  }

  updateProfileDetails(address: any): any {
    address.StoreId = this.customerSession.StoreId;
    address.SessionId = this.customerSession.SessionId;
    address.UserId = this.customerSession.UserId;
    address.AppId = this.customerSession.AppId;
    address.DeviceId = this.customerSession.DeviceId;
    address.DeviceType = this.customerSession.DeviceType;

    return address;
  }

  getCustomerPaymentMethodGetList(): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CustomerPaymentMethodGetList,
      this.getProfileDetailsRequestParams(), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.customerPaymentMethodGetList = res;
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }
  customerPaymentInsert(userProfileId: string, isDefault: number, paymentTypeId: number): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CustomerPaymentInsert,
      this.getCustomerPaymentInsertRequestParams(userProfileId, isDefault, paymentTypeId), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.customerPaymentMethodGetList = null;
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getCustomerPaymentInsertRequestParams(userProfileId: string, isDefault: number, paymentTypeId: number): CustomerPaymentInsert {
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
      UserProfileId: userProfileId,
      IsDefault: isDefault,
      PaymentTypeId: paymentTypeId
    };

  }
}
