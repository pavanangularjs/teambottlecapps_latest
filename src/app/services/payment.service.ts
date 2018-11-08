import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  URL: 'https://apitest.authorize.net/xml/v1/request.api';
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService) { }

  createCustomerProfile(): Observable<any> {
    return this.http.post<any>(this.URL,
      this.getCreateCustomerProfileRequestPayload(), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getCreateCustomerProfileRequestPayload() {
    return {
      'createCustomerProfileRequest': {
        'merchantAuthentication': {
          'name': '{{vAppLoginId}}',
          'transactionKey': '{{vTransactionKey}}'
        },
        'profile': {
          'merchantCustomerId': '{{ vUserId }}',
          'description': '',
          'email': '{{vEmailId}}',
          'paymentProfiles': {
            'customerType': 'individual',
            'billTo': {
              'firstName': 'Murli',
              'lastName': 'Krishna',
              'address': '300 East Royal Ln',
              'city': 'Irving',
              'state': 'TX',
              'zip': '508096',
              'country': 'United States',
              'phoneNumber': '6465389865'
            },
            'payment': {
              'debitCard': {
                'cardNumber': '4111111111111111',
                'expirationDate': '2025-11'
              }
            },
            'defaultPaymentProfile': false
          }
        },
        'validationMode': 'testMode'
      }
    };
  }

  getCustomerProfile(): Observable<any> {
    return this.http.post<any>(this.URL,
      this.getCustomerProfileRequestPayload(), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getCustomerProfileRequestPayload() {
    return {
      'getCustomerProfileRequest': {
        'merchantAuthentication': {
          'name': '{{vAppLoginId}}',
          'transactionKey': '{{vTransactionKey}}'
        },
        'customerProfileId': '{{vCustomerProfileId}}',
        'includeIssuerInfo': 'true'
      }
    };
  }

  deleteCustomerPaymentProfile(): Observable<any> {
    return this.http.post<any>(this.URL,
      this.deleteCustomerPaymentProfileRequestPayload(), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        retry(3),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  deleteCustomerPaymentProfileRequestPayload() {
    return {
      'deleteCustomerPaymentProfileRequest': {
        'merchantAuthentication': {
          'name': '{{vAppLoginId}}',
          'transactionKey': '{{vTransactionKey}}'
        },
        'customerProfileId': '{{vCustomerProfileId}}',
        'customerPaymentProfileId': '{{vCustomerPaymentProfileIdList}}'
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
          'name': '{{vAppLoginId}}',
          'transactionKey': '{{vTransactionKey}}'
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

