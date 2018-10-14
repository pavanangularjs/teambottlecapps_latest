import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feature-products',
  templateUrl: './feature-products.component.html',
  styleUrls: ['./feature-products.component.scss']
})
export class FeatureProductsComponent implements OnInit {
  @Input() storeGetHomeData: any;
  constructor() { }

  ngOnInit() {
  }

}
