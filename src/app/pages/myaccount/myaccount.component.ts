import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss']
})
export class MyAccountComponent implements OnInit {
  selectedOption: string;
  profileDetails: any;

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.getCustomerProfile();
  }

  getCustomerProfile() {
    this.customerService.getProfileDetails().subscribe(
      (data: any) => {
        this.profileDetails = data;
      });
  }
  onOptionSelected(option: string) {
    this.selectedOption = option;
  }
}
