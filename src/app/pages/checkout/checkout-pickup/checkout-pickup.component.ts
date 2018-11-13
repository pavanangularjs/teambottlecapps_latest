import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';

@Component({
  selector: 'app-checkout-pickup',
  templateUrl: './checkout-pickup.component.html',
  styleUrls: ['./checkout-pickup.component.scss']
})
export class CheckoutPickupComponent implements OnInit {

  storeGetHomeData: any;
  constructor(private store: Store<any>) {
    this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        this.storeGetHomeData = pssd;
      });
  }

  ngOnInit() {
  }

}
