import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../../app-config.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  offer = 'true';
  constructor(private authenticationService: AppConfigService) {
    authenticationService.getComponent.subscribe(name => { this.offer = name; });
  }
  ngOnInit() {
  }
}
