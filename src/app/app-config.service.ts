import { Injectable } from '@angular/core';

export const baseURL = 'https://staging.liquorapps.com/Bcapi/api/';

export enum AuthorizeNetURLs {
    sandBox_URL = 'https://apitest.authorize.net/xml/v1/request.api',
    prod_URL = 'https://api.authorize.net/xml/v1/request.api'
}
export enum VantivURLs {
    hostedPayments = 'https://certtransaction.hostedpayments.com/?TransactionSetupID=',
    return_URL = 'https://staging.liquorapps.com/Store/Vantiv',

    // Live Environment
    certTransaction = 'https://certtransaction.elementexpress.com/',
    certReporting = 'https://certreporting.elementexpress.com/',
    certservices = 'https://certservices.elementexpress.com/'

    // Local Environment
    /*
    certTransaction = '/certtransaction',
    certReporting = '/certreporting',
    certservices = '/certservices'
    */
    // ng serve --proxy-config=proxy.conf.json --aot
}

export enum ValidationsModes {
    test = 'testMode',
    live = 'liveMode'
}

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    deviceID = '';
    storeID = 10010;
    appID = 10002;
    URL = '';
    merchantAuthentication = {
      vAppLoginId: '5Pj5hE6a',
      vTransactionKey: '77Za8R4Wnx988xQs'
    };
    validationMode = '';

    constructor() { }

    getLoginCustomerParams(email?: string, pwd?: string, loginType?: string, sourceId?: string) {
        this.deviceID = localStorage.getItem('deviceId');
        if (this.deviceID === null) {
            this.deviceID = Math.random().toString(36).substring(2);
            localStorage.setItem('deviceId', this.deviceID);
        }
        return {
            AppId: this.appID, // 10275,
            AppVersion: '8.5',
            DeviceId: this.deviceID,
            DeviceType: 'W',
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

    decryptionKeyandTransaction(Credential1, Credential2, Credential3, StoreID) {
        if (StoreID === 10002 && Credential3 === 'T') {
          this.merchantAuthentication.vAppLoginId = '5Pj5hE6a';
          this.merchantAuthentication.vTransactionKey = '77Za8R4Wnx988xQs';
        } else if (StoreID === 10002 && Credential3 === 'L') {
          this.merchantAuthentication.vAppLoginId = '5Pj5hE6a';
          this.merchantAuthentication.vTransactionKey = '77Za8R4Wnx988xQs';
        } else if (StoreID === 10060 && Credential3 === 'T') {
          this.merchantAuthentication.vAppLoginId = '5Pj5hE6a';
          this.merchantAuthentication.vTransactionKey = '77Za8R4Wnx988xQs';
        } else if (StoreID === 10060 && Credential3 === 'L') {
          this.merchantAuthentication.vAppLoginId = '5Pj5hE6a';
          this.merchantAuthentication.vTransactionKey = '77Za8R4Wnx988xQs';
        }
      }
}
