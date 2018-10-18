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
    // this.item.IsFavorite = !this.item.IsFavorite;
    this.productService.favoriteProductUpdate(this.item.PID, status).pipe(
      map(p => {
        this.item.IsFavorite = p.IsFavorite;
        alert(p.SuccessMessage);
      }),
      catchError(error =>
        of(error)
      )
    );
  }

}
