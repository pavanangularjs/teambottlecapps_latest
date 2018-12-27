import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerLoginSession } from '../../../models/customer-login-session';
import { StoreGetHome } from '../../../state/product-store/product-store.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-place-order-result',
  templateUrl: './place-order-result.component.html',
  styleUrls: ['./place-order-result.component.scss']
})
export class PlaceOrderResultComponent implements OnInit {
  @Input() orderNumber: string;
  constructor(private router: Router,
    private store: Store<CustomerLoginSession>) { }

  ngOnInit() {
  }

  onContinueShoping() {
    // this.store.dispatch(new StoreGetHome());
    this.router.navigate(['/home']);
  }

}
