import { ProductStoreActionTypes, ProductStoreAction } from './product-store.action';

export interface StateModel {
    getStoreHomeData: any;
    productGetList: any;
}

const initialState: StateModel = {
    getStoreHomeData: null,
    productGetList: null
};

export function productStoreReducer(state = initialState, action: ProductStoreAction): StateModel {

    switch (action.type) {

        case ProductStoreActionTypes.StoreGetHomeSuccess: {
            return {
                ...state,
                getStoreHomeData: action.payload
            };
        }

        case ProductStoreActionTypes.ProductGetListSuccess: {
            return {
                ...state,
                productGetList: action.payload
            };
        }

        default:
            return state;
    }
}
