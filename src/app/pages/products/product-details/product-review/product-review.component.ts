import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent implements OnInit {
  @Input() review: any;
  @Output() edit = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  getCount(n: number): any[] {
    return Array(n);
  }
  onEdit() {
    this.edit.emit(this.review);
  }

}
