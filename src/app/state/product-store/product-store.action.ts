import { Action } from '@ngrx/store';
import { ProductGetListRequestPayload } from '../../models/product-get-list-request-payload';

export enum ProductStoreActionTypes {
    StoreGetHome = '[Store] StoreGetHome',
    StoreGetHomeSuccess = '[Store] StoreGetHomeSuccess',
    ProductGetList = '[Store] ProductGetList',
    ProductGetListSuccess = '[Store] ProductGetListSuccess',
}

export class StoreGetHome implements Action {
    readonly type = ProductStoreActionTypes.StoreGetHome;

    constructor() { }
}

export class StoreGetHomeSuccess implements Action {
    readonly type = ProductStoreActionTypes.StoreGetHomeSuccess;

    constructor(public payload: any) { }
}

export class ProductGetList implements Action {
    readonly type = ProductStoreActionTypes.ProductGetList;

    constructor(public payload: ProductGetListRequestPayload) { }
}

export class ProductGetListSuccess implements Action {
    readonly type = ProductStoreActionTypes.ProductGetListSuccess;

    constructor(public payload: any) { }
}

export const ProductStoreActions = {
    StoreGetHome,
    StoreGetHomeSuccess,
    ProductGetList,
    ProductGetListSuccess
};

export type ProductStoreAction = StoreGetHome |
StoreGetHomeSuccess |
ProductGetList |
ProductGetListSuccess;
