import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
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
