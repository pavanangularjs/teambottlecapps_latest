import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { CustomerLoginSession } from './models/customer-login-session';
import { CustomerSelectors } from './state/customer/customer.selector';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  customerSession: CustomerLoginSession;

  constructor(private store: Store<CustomerLoginSession>,
    private route: Router, private authService: AuthService) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        this.customerSession = clsd;
      });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if ((this.customerSession && this.customerSession.SessionId)) {
      return true;
    }

    this.route.navigate(['/home']);
    return false;
  }
}
