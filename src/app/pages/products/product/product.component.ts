import { Component, OnInit, Input } from '@angular/core';
import { ProductStoreService } from '../../../services/product-store.service';
import { CartService } from '../../../services/cart.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() item: any;
  constructor(private productService: ProductStoreService,
    private cartService: CartService,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
  }

  getCount(n: number): any[] {
    return Array(n);
  }

  favoriteProductUpdate(status: boolean) {
    this.spinnerService.show();
    this.productService.favoriteProductUpdate(this.item.PID, status).subscribe(
      (data: any) => {
        this.item.IsFavorite = data.IsFavorite;
        this.spinnerService.hide();
        alert(data.SuccessMessage);
      });
  }

  addToCart(item: any) {
    this.spinnerService.show();
    this.cartService.addToCard(item.PID, 1).subscribe(
      (data: any) => {
        item.InCart = 1;
        this.spinnerService.hide();
        alert(data.SuccessMessage);
      });
  }

  removeFromCart(item: any) {
    this.spinnerService.show();
    this.cartService.removeFromCart(item.PID).subscribe(
      (data: any) => {
        item.InCart = 0;
        this.spinnerService.hide();
        alert(data.SuccessMessage);
      });
  }
}
