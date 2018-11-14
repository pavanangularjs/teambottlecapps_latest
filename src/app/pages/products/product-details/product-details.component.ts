import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { ProductGetDetails } from '../../../state/product-store/product-store.action';
import { ProductGetDetailsRequestPayload } from '../../../models/product-get-details-request-payload';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  productDetails: any;
  userReviews: any;
  qty: number;

  constructor(private route: ActivatedRoute,
    private store: Store<ProductGetDetailsRequestPayload>,
    private productStoreService: ProductStoreService,
    private spinnerService: Ng4LoadingSpinnerService,
    private cartService: CartService,
    private toastr: ToastrService) {

    this.store.select(ProductStoreSelectors.productGetDetailsData)
      .subscribe(pgdd => {

        this.productDetails = pgdd;

        if (pgdd) {
          this.userReviews = [...pgdd.ListReview];

          if (pgdd && pgdd.UserReview && pgdd.UserReview.ReviewId !== 0) {
            this.userReviews = [...this.userReviews, ...pgdd.UserReview];
          }
        }

        /* if (pgdd && pgdd.ListReview && pgdd.ListReview.length > 0) {
          this.userReviews = pgdd.ListReview;
        }
        if (pgdd && pgdd.UserReview && pgdd.UserReview.ReviewId !== 0) {
          this.userReviews.push(pgdd.UserReview);
        } */
        this.spinnerService.hide();
      });
  }

  ngOnInit() {
    this.getProductDetails();
  }

  getProductDetails() {
    this.spinnerService.show();
    const productId = +this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.store.dispatch(new ProductGetDetails(this.productStoreService.getProductGetDetailsParams(productId)));
    }
  }

  onAddReview() {
    this.getProductDetails();
  }
  onRated(rating: number) {
    console.log(rating);
  }

  addToCart() {
    if (this.productDetails && this.productDetails.Product &&
      this.productDetails.Product.PID && this.qty) {
      this.cartService.addToCard(this.productDetails.Product.PID, this.qty).subscribe(
        (data: any) => {
          this.toastr.success(data.SuccessMessage);
        });
    }

  }
}
