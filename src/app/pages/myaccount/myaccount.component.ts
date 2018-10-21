import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss']
})
export class MyAccountComponent implements OnInit {
  selectedOption: string;
  profileDetails: any;

  constructor(private customerService: CustomerService,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.spinnerService.show();
    this.getCustomerProfile();
  }

  getCustomerProfile() {
    this.customerService.getProfileDetails().subscribe(
      (data: any) => {
        this.profileDetails = data;
        this.spinnerService.hide();
      });
  }
  onOptionSelected(option: string) {
    this.selectedOption = option;
  }
}
