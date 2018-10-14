import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromProductStoreState from './product-store.reducer';

export const productStoreState = createFeatureSelector<fromProductStoreState.StateModel>('productStore');

export const productStoreStateData = createSelector(
    productStoreState,
    (state) => {
        if (state) {
            return state.getStoreHomeData;
        }
    }
);
export const ProductStoreSelectors = {
    productStoreStateData
};
