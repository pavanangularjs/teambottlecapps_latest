import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { VantivPaymentProfile } from '../models/vantiv-payment-profile';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';
import { ProductStoreService } from './product-store.service';
import { Store } from '@ngrx/store';
import { AppConfigService, VantivURLs } from '../app-config.service';
import { VantivBillingAddress } from '../models/vantiv-billing-address';
import { baseUrl, UrlNames } from '../services/url-provider';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { CartService } from '../services/cart.service';

@Injectable({
    providedIn: 'root'
})
export class VantivPaymentService {
    headers = new HttpHeaders().set('Content-Type', 'text/xml; charset=utf-8');
    options = {
        headers: new HttpHeaders({ 'Content-Type': 'text/xml; charset=utf-8' }),
        responseType: 'text' as 'text'
    };
    customerSession: CustomerLoginSession;
    customerInfo: any;
    vantiveProfile: VantivPaymentProfile;
    billingAddress: VantivBillingAddress;
    vUserSelectedPaymentAccountID = '';
    vErrorTransactionID = '';
    vRequest = '';
    vResponse = '';
    vRootName = '';
    vIsSuccess: number;
    vTransactionSetupID = '';
    vTransactionID = '';
    vPaymentAccountID = '';
    vExpressResponseCode = '';

    constructor(private http: HttpClient,
        private store: Store<CustomerLoginSession>,
        private errorHandler: ErrorHandlerService,
        private productService: ProductStoreService,
        private appConfig: AppConfigService,
        private ngxXml2jsonService: NgxXml2jsonService,
        private cartService: CartService) {
        this.store.select(CustomerSelectors.customerLoginSessionData)
            .subscribe(clsd => {
                if (clsd) {
                    this.customerSession = clsd;
                    this.vantiveProfile = new VantivPaymentProfile();
                    this.billingAddress = new VantivBillingAddress();
                }
            });
        /* if (this.productService.customerInfo) {
            this.customerInfo = this.productService.customerInfo;
        } */
    }

    setVantivProfile(data: any) {
        if (!data) {
            return;
        }
        this.vantiveProfile = new VantivPaymentProfile();

        this.vantiveProfile.paymentTypeId = data.PaymentTypeId;
        this.vantiveProfile.paymentType = data.PaymentType;
        this.vantiveProfile.credential1 = data.Credential1;
        this.vantiveProfile.credential2 = data.Credential2;
        this.vantiveProfile.credential3 = data.Credential3;
        this.vantiveProfile.credential4 = data.Credential4;
        this.vantiveProfile.credential5 = data.Credential5;
        this.vantiveProfile.credential6 = data.Credential6;
        this.vantiveProfile.credential7 = data.Credential7;
        this.vantiveProfile.userProfileId = data.UserProfileId;
        this.vantiveProfile.isDefault = data.IsDefault;
        this.vantiveProfile.isLive = data.IsLive;

    }

    setBillingAddress(data: any) {
        this.billingAddress.addressEditAllowed = 1;
        this.billingAddress.billingName = data.BillingName || '';
        this.billingAddress.address1 = data.address1 || '';
        this.billingAddress.city = data.city || '';
        this.billingAddress.state = data.state || '';
        this.billingAddress.zipcode = data.zipcode || '';
        this.billingAddress.email = data.email || '';
        this.billingAddress.phone = data.phone || '';
    }

    setupTransactionID(): Observable<any> {
        this.getSetupTransactionIdRequestPayload();
        return this.http.post(VantivURLs.certTransaction,
            this.vRequest, this.options).pipe(
                switchMap((res: any) => {
                    this.vResponse = res;
                    const response = this.parseXML2Json(res);
                    this.parseSetupTransactionResponse(response);
                    return of(response);
                }),
                retry(3),
                catchError((error: any, caught: Observable<any>) => {
                    return this.errorHandler.processError(error);
                })
            );
    }

    private getSetupTransactionIdRequestPayload() {
        if (!this.vantiveProfile && !this.billingAddress) {
            return null;
        }
        const reqXML = `
        <TransactionSetup xmlns='https://transaction.elementexpress.com'>
            <Credentials>
                <AccountID>${this.vantiveProfile.credential1}</AccountID>
                <AccountToken>${this.vantiveProfile.credential2}</AccountToken>
                <AcceptorID>${this.vantiveProfile.credential3}</AcceptorID>
            </Credentials>
            <Application>
                <ApplicationID>${this.vantiveProfile.credential4}</ApplicationID>
                <ApplicationVersion>${this.vantiveProfile.credential5}</ApplicationVersion>
                <ApplicationName>${this.vantiveProfile.credential6}</ApplicationName>
            </Application>
            <PaymentAccount>
                <PaymentAccountType>1</PaymentAccountType>
                <PaymentAccountReferenceNumber>10009423</PaymentAccountReferenceNumber>
            </PaymentAccount>
            <Transaction>
                <TransactionAmount>0.00</TransactionAmount>
                <ReferenceNumber>10009423</ReferenceNumber>
                <TicketNumber>10009423</TicketNumber>
                <MarketCode>3</MarketCode>
            </Transaction>
            <TransactionSetup>
                <TransactionSetupMethod>2</TransactionSetupMethod>
                <ReturnURL> ${VantivURLs.return_URL}</ReturnURL>
                <AutoReturn>1</AutoReturn>
                <Embedded>0</Embedded>
            </TransactionSetup>
            <Terminal>
                <TerminalID>01</TerminalID>
                <CardholderPresentCode>7</CardholderPresentCode>
                <CardInputCode>4</CardInputCode>
                <TerminalCapabilityCode>5</TerminalCapabilityCode>
                <TerminalEnvironmentCode>6</TerminalEnvironmentCode>
                <TerminalType>2</TerminalType>
                <CardPresentCode>3</CardPresentCode>
                <MotoECICode>7</MotoECICode>
                <CVVPresenceCode>2</CVVPresenceCode>
            </Terminal>
            <Address>
                <BillingName>${this.billingAddress.billingName || ''}</BillingName>
                <AddressEditAllowed>${this.billingAddress.addressEditAllowed || 1}</AddressEditAllowed>
                <BillingAddress1>${this.billingAddress.address1 || ''}</BillingAddress1>
                <BillingCity>${this.billingAddress.city || ''}</BillingCity>
                <BillingState>${this.billingAddress.state || ''}</BillingState>
                <BillingZipcode>${this.billingAddress.zipcode || ''}</BillingZipcode>
                <BillingEmail>${this.billingAddress.email || ''}</BillingEmail>
                <BillingPhone>${this.billingAddress.phone || ''}</BillingPhone>
            </Address>
        </TransactionSetup>
        `;

        this.vRootName = 'TransactionSetup';
        this.vRequest = reqXML.replace(/\n|\t/g, '');
        this.vResponse = '';
    }

    private parseSetupTransactionResponse(res) {
        this.vTransactionSetupID = res.TransactionSetupResponse.Response.Transaction.TransactionSetupID;
    }

    onCardValidationSuccessGetTransactionDetails(tSetupId: string): Observable<any> {
        this.getTransactionDetailsOnCardValidationSuccessRequestPayload(tSetupId);
        return this.http.post(VantivURLs.certReporting, this.vRequest, this.options)
            .pipe(
                switchMap((res: any) => {
                    this.vResponse = res;
                    const response = this.parseXML2Json(res);
                    this.saveUpdatedBillingDetails(response);
                    return of(response);
                }),
                retry(3),
                catchError((error: any, caught: Observable<any>) => {
                    return this.errorHandler.processError(error);
                })
            );
    }

    private getTransactionDetailsOnCardValidationSuccessRequestPayload(tSetupId: string) {
        if (!this.vantiveProfile) {
            return null;
        }

        const reqXML = `<TransactionQuery xmlns='https://reporting.elementexpress.com'>
            <Credentials>
                <AccountID>${this.vantiveProfile.credential1}</AccountID>
                <AccountToken>${this.vantiveProfile.credential2}</AccountToken>
                <AcceptorID>${this.vantiveProfile.credential3}</AcceptorID>
            </Credentials>
            <Application>
                <ApplicationID>${this.vantiveProfile.credential4}</ApplicationID>
                <ApplicationVersion>${this.vantiveProfile.credential5}</ApplicationVersion>
                <ApplicationName>${this.vantiveProfile.credential6}</ApplicationName>
            </Application>
            <Parameters>
                <TransactionSetupID>${tSetupId}</TransactionSetupID>
            </Parameters>
        </TransactionQuery>
        `;

        this.vRootName = 'TransactionQuery';
        this.vRequest = reqXML.replace(/\n|\t/g, '');
        this.vResponse = '';
    }

    private saveUpdatedBillingDetails(data) {
        if (data && data.TransactionQueryResponse &&
            data.TransactionQueryResponse.Response &&
            data.TransactionQueryResponse.Response.ReportingData &&
            data.TransactionQueryResponse.Response.ReportingData.Items &&
            data.TransactionQueryResponse.Response.ReportingData.Items.Item) {

            const item = data.TransactionQueryResponse.Response.ReportingData.Items.Item;

            this.billingAddress.addressEditAllowed = 1;
            this.billingAddress.billingName = item.BillingName || this.billingAddress.billingName;
            this.billingAddress.address1 = item.BillingAddress1 || this.billingAddress.address1;
            this.billingAddress.city = item.BillingCity || this.billingAddress.city;
            this.billingAddress.state = item.BillingState || this.billingAddress.state;
            this.billingAddress.zipcode = item.BillingZipCode || this.billingAddress.zipcode;
            this.billingAddress.email = item.BillingEmail || this.billingAddress.email;
            this.billingAddress.phone = item.BillingPhone || this.billingAddress.phone;

            this.vTransactionID = item.TransactionID || '';
        }
    }

    OnSuccessParseDetailsForAddCardRequest(): Observable<any> {
        this.onSuccessParseDetailsForAddCardRequestPayload();
        return this.http.post(VantivURLs.certservices, this.vRequest, this.options)
            .pipe(
                switchMap((res: any) => {
                    // return of(res);
                    this.vResponse = res;
                    const response = this.parseXML2Json(res);
                    this.savePaymentAccountID(response);
                    return of(response);
                }),
                retry(3),
                catchError((error: any, caught: Observable<any>) => {
                    return this.errorHandler.processError(error);
                })
            );
    }

    private onSuccessParseDetailsForAddCardRequestPayload() {
        if (!this.vantiveProfile) {
            return null;
        }

        const reqXML = `<PaymentAccountCreateWithTransID xmlns='https://services.elementexpress.com'>
            <Credentials>
                <AccountID>${this.vantiveProfile.credential1}</AccountID>
                <AccountToken>${this.vantiveProfile.credential2}</AccountToken>
                <AcceptorID>${this.vantiveProfile.credential3}</AcceptorID>
            </Credentials>
            <Application>
                <ApplicationID>${this.vantiveProfile.credential4}</ApplicationID>
                <ApplicationVersion>${this.vantiveProfile.credential5}</ApplicationVersion>
                <ApplicationName>${this.vantiveProfile.credential6}</ApplicationName>
            </Application>
            <PaymentAccount>
                <PaymentAccountType>0</PaymentAccountType>
                <PaymentAccountReferenceNumber>${this.customerSession.UserId}</PaymentAccountReferenceNumber>
            </PaymentAccount>
            <Transaction>
                <TransactionID>${this.vTransactionID}</TransactionID>
            </Transaction>
            <Address>
                <BillingName>${this.billingAddress.billingName}</BillingName>
                <BillingAddress1>${this.billingAddress.address1}</BillingAddress1>
                <BillingCity>${this.billingAddress.city}</BillingCity>
                <BillingState>${this.billingAddress.state}</BillingState>
                <BillingZipcode>${this.billingAddress.zipcode}</BillingZipcode>
                <BillingEmail>${this.billingAddress.email}</BillingEmail>
                <BillingPhone>${this.billingAddress.phone}</BillingPhone>
            </Address>
        </PaymentAccountCreateWithTransID>`;

        this.vRootName = 'PaymentAccountCreateWithTransID';
        this.vRequest = reqXML.replace(/\n|\t/g, '');
        this.vResponse = '';
    }

    private savePaymentAccountID(data) {
        if (data && data.PaymentAccountCreateWithTransIDResponse &&
            data.PaymentAccountCreateWithTransIDResponse.Response &&
            data.PaymentAccountCreateWithTransIDResponse.Response.PaymentAccount &&
            data.PaymentAccountCreateWithTransIDResponse.Response.PaymentAccount.PaymentAccountID) {

            this.vPaymentAccountID = data.PaymentAccountCreateWithTransIDResponse.Response.PaymentAccount.PaymentAccountID;
        }

    }

    getAddedCards(): Observable<any> {
        this.getAddedCardsRequestPayload();
        return this.http.post(VantivURLs.certservices, this.vRequest, this.options)
            .pipe(
                switchMap((res: any) => {
                    this.vResponse = res;
                    return of(this.parseXML2Json(res));
                }),
                retry(3),
                catchError((error: any, caught: Observable<any>) => {
                    return this.errorHandler.processError(error);
                })
            );
    }

    private getAddedCardsRequestPayload() {
        if (!this.vantiveProfile) {
            return null;
        }

        const reqXML = `<PaymentAccountQuery xmlns='https://services.elementexpress.com'>
            <Credentials>
                <AccountID>${this.vantiveProfile.credential1}</AccountID>
                <AccountToken>${this.vantiveProfile.credential2}</AccountToken>
                <AcceptorID>${this.vantiveProfile.credential3}</AcceptorID>
            </Credentials>
            <Application>
                <ApplicationID>${this.vantiveProfile.credential4}</ApplicationID>
                <ApplicationVersion>${this.vantiveProfile.credential5}</ApplicationVersion>
                <ApplicationName>${this.vantiveProfile.credential6}</ApplicationName>
            </Application>
            <PaymentAccountParameters>
                <PaymentAccountReferenceNumber>${this.customerSession.UserId}</PaymentAccountReferenceNumber>
            </PaymentAccountParameters>
        </PaymentAccountQuery>`;

        // return reqXML.replace(/\n|\t|\s/g, '');
        this.vRootName = 'PaymentAccountQuery';
        this.vRequest = reqXML.replace(/\n|\t/g, '');
        this.vResponse = '';
    }

    private parseGetAddedCardsResponse(data) {
        if (data && data.PaymentAccountQueryResponse &&
            data.PaymentAccountQueryResponse.Response &&
            data.PaymentAccountQueryResponse.Response.QueryData &&
            data.PaymentAccountQueryResponse.Response.QueryData.Items &&
            data.PaymentAccountQueryResponse.Response.QueryData.Items.Item &&
            data.PaymentAccountQueryResponse.Response.QueryData.Items.Item.PaymentAccountID) {

            this.vUserSelectedPaymentAccountID = data.PaymentAccountQueryResponse.Response.QueryData.Items.Item.PaymentAccountID;
        }
    }

    CreditCardAuthorization(vTotalValue: number): Observable<any> {
        this.getCreditCardAuthorizationRequestPayload(vTotalValue);
        return this.http.post(VantivURLs.certTransaction, this.vRequest, this.options)
            .pipe(
                switchMap((res: any) => {
                    this.vResponse = res;
                    this.vIsSuccess = 1;
                    const response = this.parseXML2Json(res);
                    this.parseAuthorizationResponse(response);
                    return of(response);
                }),
                retry(3),
                catchError((error: any, caught: Observable<any>) => {
                    this.vIsSuccess = 0;
                    return this.errorHandler.processError(error);
                })
            );
    }

    private getCreditCardAuthorizationRequestPayload(vTotalValue: number) {
        if (!this.vantiveProfile) {
            return null;
        }

        const cartId = (this.cartService.cartdetails && this.cartService.cartdetails.CartId) || '';
        const vRefIdVantiv = `${this.customerSession.UserId}-${cartId}`;
        const reqXML = `<CreditCardAuthorization xmlns='https://transaction.elementexpress.com'>
            <Credentials>
                <AccountID>${this.vantiveProfile.credential1}</AccountID>
                <AccountToken>${this.vantiveProfile.credential2}</AccountToken>
                <AcceptorID>${this.vantiveProfile.credential3}</AcceptorID>
            </Credentials>
            <Application>
                <ApplicationID>${this.vantiveProfile.credential4}</ApplicationID>
                <ApplicationVersion>${this.vantiveProfile.credential5}</ApplicationVersion>
                <ApplicationName>${this.vantiveProfile.credential6}</ApplicationName>
            </Application>
            <Terminal>
                <TerminalID>01</TerminalID>
                <CardholderPresentCode>7</CardholderPresentCode>
                <CardInputCode>4</CardInputCode>
                <TerminalCapabilityCode>5</TerminalCapabilityCode>
                <TerminalEnvironmentCode>6</TerminalEnvironmentCode>
                <TerminalType>2</TerminalType>
                <CardPresentCode>3</CardPresentCode>
                <MotoECICode>7</MotoECICode>
                <CVVPresenceCode>0</CVVPresenceCode>
            </Terminal>
            <ExtendedParameters>
                <PaymentAccount>
                    <PaymentAccountID>${this.vUserSelectedPaymentAccountID}</PaymentAccountID>
                </PaymentAccount>
            </ExtendedParameters>
            <Transaction>
                <TransactionAmount>${vTotalValue}</TransactionAmount>
                <ReferenceNumber>${this.customerSession.UserId}</ReferenceNumber>
                <TicketNumber>${vRefIdVantiv}</TicketNumber>
                <MarketCode>3</MarketCode>
                <DuplicateCheckDisableFlag>1</DuplicateCheckDisableFlag>
            </Transaction>
        </CreditCardAuthorization>`;

        this.vRootName = 'CreditCardAuthorization';
        this.vRequest = reqXML.replace(/\n|\t/g, '');
        this.vResponse = '';
    }

    private parseAuthorizationResponse(res) {
        this.vExpressResponseCode = res.CreditCardAuthorizationResponse.Response.ExpressResponseCode || null;

        if (this.vExpressResponseCode === '1001' || this.vExpressResponseCode === '1002') {
            this.vErrorTransactionID = res.CreditCardAuthorizationResponse.Response.Transaction.TransactionID;
        }
    }

    CreditCardSale(vTotalValue: number): Observable<any> {
        this.getCreditCardSaleRequestPayload(vTotalValue);
        return this.http.post(VantivURLs.certTransaction, this.vRequest, this.options)
            .pipe(
                switchMap((res: any) => {
                    this.vResponse = res;
                    const response = this.parseXML2Json(res);
                    this.vIsSuccess = 1;
                    this.parseSaleResponse(response);
                    return of(response);
                }),
                retry(3),
                catchError((error: any, caught: Observable<any>) => {
                    this.vIsSuccess = 0;
                    return this.errorHandler.processError(error);
                })
            );
    }

    private getCreditCardSaleRequestPayload(vTotalValue: number) {
        if (!this.vantiveProfile) {
            return null;
        }

        const cartId = (this.cartService.cartdetails && this.cartService.cartdetails.CartId) || '';
        const vRefIdVantiv = `${this.customerSession.UserId}-${cartId}`;
        const reqXML = `<CreditCardSale xmlns='https://transaction.elementexpress.com'>
            <Credentials>
                <AccountID>${this.vantiveProfile.credential1}</AccountID>
                <AccountToken>${this.vantiveProfile.credential2}</AccountToken>
                <AcceptorID>${this.vantiveProfile.credential3}</AcceptorID>
            </Credentials>
            <Application>
                <ApplicationID>${this.vantiveProfile.credential4}</ApplicationID>
                <ApplicationVersion>${this.vantiveProfile.credential5}</ApplicationVersion>
                <ApplicationName>${this.vantiveProfile.credential6}</ApplicationName>
            </Application>
            <Terminal>
                <TerminalID>01</TerminalID>
                <CardholderPresentCode>7</CardholderPresentCode>
                <CardInputCode>4</CardInputCode>
                <TerminalCapabilityCode>5</TerminalCapabilityCode>
                <TerminalEnvironmentCode>6</TerminalEnvironmentCode>
                <TerminalType>2</TerminalType>
                <CardPresentCode>3</CardPresentCode>
                <MotoECICode>7</MotoECICode>
                <CVVPresenceCode>0</CVVPresenceCode>
            </Terminal>
            <ExtendedParameters>
                <PaymentAccount>
                    <PaymentAccountID>${this.vUserSelectedPaymentAccountID}</PaymentAccountID>
                </PaymentAccount>
            </ExtendedParameters>
            <Transaction>
                <TransactionAmount>${vTotalValue}</TransactionAmount>
                <ReferenceNumber>${this.customerSession.UserId}</ReferenceNumber>
                <TicketNumber>${vRefIdVantiv}</TicketNumber>
                <MarketCode>3</MarketCode>
                <DuplicateCheckDisableFlag>1</DuplicateCheckDisableFlag>
            </Transaction>
        </CreditCardSale>`;

        this.vRootName = 'CreditCardSale';
        this.vRequest = reqXML.replace(/\n|\t|\s/g, '');
        this.vResponse = '';
    }

    private parseSaleResponse(res) {
        this.vExpressResponseCode = res.CreditCardSaleResponse.Response.ExpressResponseCode || null;

        if (this.vExpressResponseCode === '1001' || this.vExpressResponseCode === '1002' || this.vExpressResponseCode === null) {
            this.vErrorTransactionID = res.CreditCardSaleResponse.Response.Transaction.TransactionID;
            this.CreditCardReversal();
        }
    }

    CreditCardReversal(): Observable<any> {
        this.getCreditCardReversalRequestPayload();
        return this.http.post(VantivURLs.certTransaction, this.vRequest, this.options)
            .pipe(
                switchMap((res: any) => {
                    this.vResponse = res;
                    this.vIsSuccess = 1;
                    return of(res);
                }),
                retry(3),
                catchError((error: any, caught: Observable<any>) => {
                    return this.errorHandler.processError(error);
                })
            );
    }

    private getCreditCardReversalRequestPayload() {
        if (!this.vantiveProfile) {
            return null;
        }
        const cartId = (this.cartService.cartdetails && this.cartService.cartdetails.CartId) || '';
        const vRefIdVantiv = `${this.customerSession.UserId}-${cartId}`;
        const reqXML = `<CreditCardReversal xmlns='https://transaction.elementexpress.com'>
            <Credentials>
                <AccountID>${this.vantiveProfile.credential1}</AccountID>
                <AccountToken>${this.vantiveProfile.credential2}</AccountToken>
                <AcceptorID>${this.vantiveProfile.credential3}</AcceptorID>
            </Credentials>
            <Application>
                <ApplicationID>${this.vantiveProfile.credential4}</ApplicationID>
                <ApplicationVersion>${this.vantiveProfile.credential5}</ApplicationVersion>
                <ApplicationName>${this.vantiveProfile.credential6}</ApplicationName>
            </Application>
            <Terminal>
                <TerminalID>01</TerminalID>
                <CardholderPresentCode>7</CardholderPresentCode>
                <CardInputCode>4</CardInputCode>
                <TerminalCapabilityCode>5</TerminalCapabilityCode>
                <TerminalEnvironmentCode>6</TerminalEnvironmentCode>
                <TerminalType>2</TerminalType>
                <CardPresentCode>3</CardPresentCode>
                <MotoECICode>7</MotoECICode>
                <CVVPresenceCode>0</CVVPresenceCode>
            </Terminal>
            <Transaction>
                <TransactionAmount>10.02</TransactionAmount>
                <ReversalType>0</ReversalType>
                <ReferenceNumber>${this.customerSession.UserId}</ReferenceNumber>
                <TicketNumber>${vRefIdVantiv}</TicketNumber>
                <MarketCode>3</MarketCode>
                <TransactionID>${this.vErrorTransactionID}</TransactionID>
            </Transaction>
        </CreditCardReversal>`;

        this.vRootName = 'CreditCardReversal';
        this.vRequest = reqXML.replace(/\n|\t|\s/g, '');
        this.vResponse = '';
    }

    insertVantivRequestAndResponse(): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.VantivRequestAndResponseInsert,
            this.getVantivRequestAndResponseInsertParams(), { headers: this.headers }).pipe(
                switchMap((res: any) => {
                    return of(res);
                }),
                retry(3),
                catchError((error: any, caught: Observable<any>) => {
                    return this.errorHandler.processError(error);
                })
            );
    }

    private getVantivRequestAndResponseInsertParams(): any {
        if (!this.customerSession) {
            return null;
        }
        return {
            StoreId: this.customerSession.StoreId,
            UserId: this.customerSession.UserId,
            SessionId: this.customerSession.SessionId,
            AppId: this.customerSession.AppId,
            DeviceId: this.customerSession.DeviceId,
            DeviceType: this.customerSession.DeviceType,
            IsSuccess: this.vIsSuccess || true,
            Request: this.vRequest,
            Response: this.vResponse,
            VantivAction: this.vRootName
        };
    }

    parseXML2Json(data) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'text/xml');
        const obj = this.ngxXml2jsonService.xmlToJson(xml);
        console.log(obj);
        return obj;
    }
}
