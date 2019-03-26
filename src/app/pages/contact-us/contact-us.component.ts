import { Component, OnInit } from '@angular/core';
import { ProductStoreService } from '../../services/product-store.service';
import { CustomerLoginSession } from '../../models/customer-login-session';
import { CustomerSelectors } from '../../state/customer/customer.selector';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  storeDetails: any;
  mapURL: SafeResourceUrl;

  constructor(
    public sanitizer: DomSanitizer,
    private store: Store<CustomerLoginSession>,
    private storeService: ProductStoreService) {

    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.getStoreDetails();
        }
      });
  }

  ngOnInit() {
    // this.mapURL = '';
  }

  getStoreDetails() {
    this.storeService.getStoreDetails().subscribe(data => {
      if (data && data.GetStoredetails) {
        this.storeDetails = data.GetStoredetails;
        const url = `https://maps.google.com/maps?q=${this.storeDetails.Latitude},${this.storeDetails.Longitude}&hl=es;z=14&output=embed` ;
        this.mapURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    });
  }

}
