import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import SmartBanner from 'smart-app-banner';

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

  constructor(private deviceService: DeviceDetectorService) {
    new SmartBanner({
      daysHidden: 15,   // days to hide banner after close button is clicked (defaults to 15)
      daysReminder: 90, // days to hide banner after "VIEW" button is clicked (defaults to 90)
      appStoreLanguage: 'us', // language code for the App Store (defaults to user's browser language)
      title: 'Lukas',
      author: '',
      button: 'VIEW',
      store: {
        android: 'In Google Play'
      },
      price: {
        android: 'FREE'
      }
    });
  }

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
