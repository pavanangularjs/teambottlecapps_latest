import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('openModal') openModal: ElementRef;
  title = 'TeamBottlecApps';
  // template = `<img src='/assets/Images/loading_icon.gif' />`;
  isMobile: boolean;

  constructor(private deviceService: DeviceDetectorService) { }

  ngOnInit() {
    /* To Show Mobile Banner */
    // this.isMobile = this.deviceService.isMobile();

    /* For Mobile WebSite */
    this.isMobile = false;

    if (!this.isMobile && localStorage.getItem('isAgeVerified') !== 'true') {
      this.openModal.nativeElement.click();
    }
  }
}
