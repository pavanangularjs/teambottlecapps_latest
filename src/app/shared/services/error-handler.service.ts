import { Injectable } from '@angular/core';
import { Observable, throwError, EMPTY } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CustomerLoginSession } from '../../models/customer-login-session';
import { CustomerSelectors } from '../../state/customer/customer.selector';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  customerSession: CustomerLoginSession;

  constructor(private toastr: ToastrService, private store: Store<CustomerLoginSession>,
    private route: Router) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        this.customerSession = clsd;
      });
  }

  processError(error: any): Observable<any> {
    if (error.status) {
      if (error.status === 401) {

        if ((this.customerSession && this.customerSession.UserId === 0)) {
          this.route.navigate(['/home'], { queryParams: { returnUrl: this.route.url } });
        } else {
          this.route.navigate(['/login'], { queryParams: { returnUrl: this.route.url } });
        }

        return EMPTY;
      } else if (error.status === 400) {
        if (error.error && error.error.ErrorMessage && error.error.ErrorMessage !== 'Invalid Request.') {
          this.toastr.error(error.error.ErrorMessage);
        } else {
          if ((this.customerSession && this.customerSession.UserId === 0)) {
            this.route.navigate(['/home'], { queryParams: { returnUrl: this.route.url } });
          } else {
            this.route.navigate(['/login'], { queryParams: { returnUrl: this.route.url } });
          }
        }
        return EMPTY;
      }
    }
    return throwError(error);
  }
}
