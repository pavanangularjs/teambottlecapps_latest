import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../../app-config.service';
@Component({
  selector: 'app-downloadapp',
  templateUrl: './downloadapp.component.html',
  styleUrls: ['./downloadapp.component.scss']
})
export class DownloadappComponent implements OnInit {
  downloadapp = 'true';

  constructor(private authenticationService: AppConfigService) {
    authenticationService.getDownload.subscribe(name => { this.downloadapp = name; });
  }

  ngOnInit() {
  }

}
