import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-place-order-result',
  templateUrl: './place-order-result.component.html',
  styleUrls: ['./place-order-result.component.scss']
})
export class PlaceOrderResultComponent implements OnInit {
  @Input() orderNumber: string;
  constructor() { }

  ngOnInit() {
  }

}
