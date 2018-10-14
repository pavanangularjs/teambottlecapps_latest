import { ProductStoreActionTypes, ProductStoreAction } from './product-store.action';

export interface StateModel {
    getStoreHomeData: any;
}

const initialState: StateModel = {
    getStoreHomeData: null
};

export function productStoreReducer(state = initialState, action: ProductStoreAction): StateModel {

    switch (action.type) {

        case ProductStoreActionTypes.StoreGetHomeSuccess: {
            return {
                ...state,
                getStoreHomeData: action.payload
            };
        }

        default:
            return state;
    }
}
