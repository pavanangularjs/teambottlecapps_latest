import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    deviceID = '';
    storeID = 10060;
    constructor() { }

    getLoginCustomerParams(email?: string, pwd?: string, loginType?: string, sourceId?: string) {
        return {
            AppId: 10060, // 10275,
            AppVersion: '8.5',
            DeviceId: this.deviceID,
            DeviceType: this.deviceID,
            EmailId: email || '',
            LoginType: loginType || 'B',
            Password: pwd || '',
            StoreId: this.storeID, // 10275,
            SourceId: sourceId || '',
            SessionId: '',
            UserId: '',
            UserIp: ''
        };
    }
}
