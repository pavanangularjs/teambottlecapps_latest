import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { ProductGetDetails } from '../../../state/product-store/product-store.action';
import { ProductGetDetailsRequestPayload } from '../../../models/product-get-details-request-payload';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  productDetails: any;

  constructor(private route: ActivatedRoute,
    private store: Store<ProductGetDetailsRequestPayload>,
    private productStoreService: ProductStoreService,
    private spinnerService: Ng4LoadingSpinnerService) {

    this.store.select(ProductStoreSelectors.productGetDetailsData)
      .subscribe(pgdd => {
        this.productDetails = pgdd;
        this.spinnerService.hide();
      });
  }

  ngOnInit() {
    this.getProductDetails();
  }

  getProductDetails() {
    this.spinnerService.show();
    const productId = +this.route.snapshot.paramMap.get('id');
    if ( productId ) {
      this.store.dispatch(new ProductGetDetails(this.productStoreService.getProductGetDetailsParams(productId)));
    }
  }
  onRated(rating: number) {
    console.log(rating);
  }
}
