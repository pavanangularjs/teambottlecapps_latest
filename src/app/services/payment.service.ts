import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { PaymentProfile } from '../models/payment-profile';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';
import { ProductStoreService } from './product-store.service';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  URL = 'https://apitest.authorize.net/xml/v1/request.api';
  merchantAuthentication = {
    vAppLoginId: '5Pj5hE6a',
    vTransactionKey: '77Za8R4Wnx988xQs'
  };
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  customerSession: CustomerLoginSession;
  customerInfo: any;

  constructor(private http: HttpClient, private store: Store<CustomerLoginSession>,
    private errorHandler: ErrorHandlerService, private productService: ProductStoreService) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.customerSession = clsd;
        }
      });
      if (this.productService.customerInfo) {
        this.customerInfo = this.productService.customerInfo;
      }
  }

  createCustomerProfile(profile: PaymentProfile): Observable<any> {
    return this.http.post<any>(this.URL,
      this.getCreateCustomerProfileRequestPayload(profile), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getCreateCustomerProfileRequestPayload(profile: PaymentProfile) {
    if (!this.customerSession && !this.customerInfo) {
      return null;
    }

    return {
      'createCustomerProfileRequest': {
        'merchantAuthentication': {
          'name': this.merchantAuthentication.vAppLoginId,
          'transactionKey': this.merchantAuthentication.vTransactionKey
        },
        'profile': {
          'merchantCustomerId': this.customerSession.UserId,
          'description': profile.description,
          'email': this.customerInfo.EmailId,
          'paymentProfiles': {
            'customerType': profile.customerType,
            'billTo': {
              'firstName': profile.firstName,
              'lastName': profile.lastName,
              'address': profile.address,
              'city': profile.city,
              'state': profile.state,
              'zip': profile.zip,
              'country': profile.country,
              'phoneNumber': this.customerInfo.ContactNo
            },
            'payment': {
              'creditCard': {
                'cardNumber': profile.cardNumber,
                'expirationDate': profile.expirationDate
              }
            },
            'defaultPaymentProfile': profile.defaultPaymentProfile
          }
        },
        'validationMode': profile.validationMode
      }
    };
  }

  createCustomerPaymentProfileRequest(profile: PaymentProfile): Observable<any> {
    return this.http.post<any>(this.URL,
      this.getCreateCustomerPaymentProfileRequestPayload(profile), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getCreateCustomerPaymentProfileRequestPayload(profile: PaymentProfile) {
    if (!this.customerSession && !this.customerInfo) {
      return null;
    }

    return {
      'createCustomerPaymentProfileRequest': {
        'merchantAuthentication': {
          'name': this.merchantAuthentication.vAppLoginId,
          'transactionKey': this.merchantAuthentication.vTransactionKey
        },
        'customerProfileId': profile.customerProfileId,
        'paymentProfile': {
          'billTo': {
            'firstName': profile.firstName,
            'lastName': profile.lastName,
            'address': profile.address,
            'city': profile.city,
            'state': profile.state,
            'zip': profile.zip,
            'country': profile.country,
            'phoneNumber': profile.phoneNumber
          },
          'payment': {
            'creditCard': {
              'cardNumber': profile.cardNumber,
              'expirationDate': profile.expirationDate
            }
          },
          'defaultPaymentProfile': profile.defaultPaymentProfile
        },
        'validationMode': profile.validationMode
      }
    };
  }
  getExistingCards(profileId: string): Observable<any> {
    return this.http.post<any>(this.URL, this.getCustomerProfileRequestPayload(profileId), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getCustomerProfileRequestPayload(profileId: string) {
    return {
      'getCustomerProfileRequest': {
        'merchantAuthentication': {
          'name': this.merchantAuthentication.vAppLoginId,
          'transactionKey': this.merchantAuthentication.vTransactionKey
        },
        'customerProfileId': profileId,
        'includeIssuerInfo': 'true'
      }
    };
  }

  deleteCustomerPaymentProfile(profileId: string, paymentProfileId: string): Observable<any> {
    return this.http.post<any>(this.URL,
      this.deleteCustomerPaymentProfileRequestPayload(profileId, paymentProfileId), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  deleteCustomerPaymentProfileRequestPayload(profileId: string, paymentProfileId: string) {
    return {
      'deleteCustomerPaymentProfileRequest': {
        'merchantAuthentication': {
          'name': this.merchantAuthentication.vAppLoginId,
          'transactionKey': this.merchantAuthentication.vTransactionKey
        },
        'customerProfileId': profileId,
        'customerPaymentProfileId': paymentProfileId
      }
    };
  }

  createTransactionRequest(): Observable<any> {
    return this.http.post<any>(this.URL,
      this.createTransactionRequestPayload(), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  createTransactionRequestPayload() {
    return {
      'createTransactionRequest': {
        'merchantAuthentication': {
          'name': this.merchantAuthentication.vAppLoginId,
          'transactionKey': this.merchantAuthentication.vTransactionKey
        },
        'refId': '{{vRefId}}',
        'transactionRequest': {
          'transactionType': 'authOnlyTransaction',
          'amount': 22.09,
          'profile': {
            'customerProfileId': '{{vCustomerProfileId}}',
            'paymentProfile': {
              'paymentProfileId': '{{vCustomerPaymentProfileIdList}}',
              'cardCode': '353'
            }
          },
          'tax': {
            'amount': 3.11,
            'name': 'Sale Tax',
            'description': 'Sale Tax'
          }
        }
      }
    };
  }
}

