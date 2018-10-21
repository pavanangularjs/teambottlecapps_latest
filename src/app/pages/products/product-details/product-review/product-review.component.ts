import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent implements OnInit {
  @Input() review: any;
  constructor() { }

  ngOnInit() {
  }

  getCount(n: number): any[] {
    return Array(n);
  }

}
