import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { ProductGetDetails } from '../../../state/product-store/product-store.action';
import { ProductGetDetailsRequestPayload } from '../../../models/product-get-details-request-payload';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  productDetails: any;

  constructor(private route: ActivatedRoute,
    private store: Store<ProductGetDetailsRequestPayload>,
    private productStoreService: ProductStoreService) {

    this.store.select(ProductStoreSelectors.productGetDetailsData)
      .subscribe(pgdd => {
        this.productDetails = pgdd;
      });
  }

  ngOnInit() {
    this.getProductDetails();
  }

  getProductDetails() {
    const productId = +this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new ProductGetDetails(this.productStoreService.getProductGetDetailsParams(productId)));
  }
}
