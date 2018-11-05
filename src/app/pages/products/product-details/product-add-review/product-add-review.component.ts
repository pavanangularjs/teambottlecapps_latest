import { Component, OnInit, Input } from '@angular/core';
import { ProductStoreService } from '../../../../services/product-store.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-add-review',
  templateUrl: './product-add-review.component.html',
  styleUrls: ['./product-add-review.component.scss']
})
export class ProductAddReviewComponent implements OnInit {
  @Input() productId: number;

  formAddProductReview: FormGroup;
  rating = 0;

  constructor(private productService: ProductStoreService,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.formAddProductReview = new FormGroup({
      rTitle: new FormControl(''),
      rDescription: new FormControl(''),
    });
  }

  onAddReview() {
    this.spinnerService.show();
    const title = this.formAddProductReview.get('rTitle').value;
    const description = this.formAddProductReview.get('rDescription').value;

    this.productService.addProductReview(this.productId, title, description, this.rating ).subscribe(
      (data: any) => {
        this.toastr.success(data.SuccessMessage);
        this.spinnerService.hide();
      });
  }

  onRated(rating) {

  }
}
