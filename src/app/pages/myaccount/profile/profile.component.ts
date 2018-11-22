import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
 profile: any;
  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.customerService.getProfileDetails().subscribe(
      (data: any) => {
        this.profile = data;
    });
  }

}
