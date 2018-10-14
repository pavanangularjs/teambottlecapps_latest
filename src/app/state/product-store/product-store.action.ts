import { Action } from '@ngrx/store';
import { StoreGetHomeRequestPayload } from '../../models/store-get-home-request-payload';

export enum ProductStoreActionTypes {
    StoreGetHome = '[Store] StoreGetHome',
    StoreGetHomeSuccess = '[Store] StoreGetHomeSuccess',
}

export class StoreGetHome implements Action {
    readonly type = ProductStoreActionTypes.StoreGetHome;

    constructor() { }
}

export class StoreGetHomeSuccess implements Action {
    readonly type = ProductStoreActionTypes.StoreGetHomeSuccess;

    constructor(public payload: any) { }
}

export const ProductStoreActions = {
    StoreGetHome,
    StoreGetHomeSuccess
};

export type ProductStoreAction = StoreGetHome | StoreGetHomeSuccess;
