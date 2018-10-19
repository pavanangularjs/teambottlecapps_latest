import { Component, OnInit, Input } from '@angular/core';
import { ProductStoreService } from '../../../services/product-store.service';
import { withLatestFrom, switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() item: any;
  constructor(private productService: ProductStoreService) { }

  ngOnInit() {
  }

  getCount(n: number): any[] {
    return Array(n);
  }

  favoriteProductUpdate(status: boolean) {
    this.productService.favoriteProductUpdate(this.item.PID, status).subscribe(
      (data: any) => {
        this.item.IsFavorite = data.IsFavorite;
        alert(data.SuccessMessage);
      });
  }

}
