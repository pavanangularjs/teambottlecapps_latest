import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { CustomerLoginSession } from './models/customer-login-session';
import { CustomerSelectors } from './state/customer/customer.selector';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  customerSession: CustomerLoginSession;

  constructor(private store: Store<CustomerLoginSession>,
    private route: Router,
    private toastr: ToastrService) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        this.customerSession = clsd;
      });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if ((this.customerSession && this.customerSession.SessionId && this.customerSession.UserId > 0)) {
      return true;
    }

    const demail = localStorage.getItem('email');
    const dpass = localStorage.getItem('password');

    if (!(demail && dpass)) {
      this.toastr.info('Please Sign In');
    }

    this.route.navigate(['/login']);
    return false;
  }
}
