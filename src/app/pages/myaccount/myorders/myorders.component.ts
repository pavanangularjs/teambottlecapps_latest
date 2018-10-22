import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  myOrdersList: any[];

  constructor(private ordersService: OrdersService,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.getMyOrders();
  }

  getMyOrders() {
    this.spinnerService.show();
    this.ordersService.getMyOrdersList().subscribe(
      (data: any) => {
        this.myOrdersList = data;
        this.spinnerService.hide();
      });
  }

}
