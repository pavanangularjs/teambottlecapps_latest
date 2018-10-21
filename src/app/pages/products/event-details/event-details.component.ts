import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { EventGetDetails } from '../../../state/product-store/product-store.action';
import { EventGetDetailsRequestPayload } from '../../../models/event-get-details-request-payload';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {

  eventDetails: any;

  constructor(private route: ActivatedRoute,
    private store: Store<EventGetDetailsRequestPayload>,
    private productStoreService: ProductStoreService,
    private spinnerService: Ng4LoadingSpinnerService) {

    this.store.select(ProductStoreSelectors.eventGetDetailsData)
      .subscribe(egdd => {
        this.eventDetails = egdd;
        this.spinnerService.hide();
      });
  }

  ngOnInit() {
    this.getEventDetails();
  }

  getEventDetails() {
    this.spinnerService.show();
    const eventId = +this.route.snapshot.paramMap.get('id');
    if ( eventId ) {
      this.store.dispatch(new EventGetDetails(this.productStoreService.getEventGetDetailsParams(eventId)));
    }
  }
}
