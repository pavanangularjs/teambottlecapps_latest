import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cart-review',
  templateUrl: './cart-review.component.html',
  styleUrls: ['./cart-review.component.scss']
})
export class CartReviewComponent implements OnInit {
  @Input() cartItems: any;
  constructor() { }

  ngOnInit() {
  }

}
