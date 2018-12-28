import { baseURL } from '../app-config.service';
export const baseUrl = baseURL;

export enum UrlNames {
    GetStoreHome = 'Store/StoreGetHome',
    StoreGetDetail = 'Store/StoreGetDetail',
    StoreGetList = 'Store/StoreGetList',
    LoginCustomer = 'Login/LoginCustomer',
    ProductGetList = 'Product/ProductGetList',
    ProductGetDetails = 'Product/ProductGetDetail',
    EventGetDetails = 'Event/EventGetDetail',
    FavoriteProductUpdate = 'Product/FavoriteProductUpdate',
    RecipeGetList = 'Recipe/RecipeGetList',
    RecipeGetDetail = 'Recipe/RecipeGetDetail',
    CartAddItem = 'Cart/CartAddItem',
    CartRemoveItem = 'Cart/CartRemoveItem',
    CartGetDetail = 'Cart/CartGetDetail',
    ReviewRatingInsert = 'Review/ReviewRatingInsert',
    ReviewRatingUpdate = 'Review/ReviewRatingUpdate',
    OrderGetList = 'Order/OrderGetList',
    OrderInsert = 'Cart/OrderInsert',
    OrderCancel = 'Order/OrderCancel',
    CartUpdate = 'Cart/CartUpdate',
    CustomerAddressGetList = 'Customer/CustomerAddressGetList',
    AddressInsert = 'Customer/AddressInsert',
    AddressDelete = 'Customer/AddressDelete',
    AddressUpdate = 'Customer/AddressUpdate',
    ProfileGetDetail = 'Customer/ProfileGetDetail',
    CustomerProfileUpdate = 'Customer/CustomerProfileUpdate',
    UploadImage = 'Customer/UploadImage',
    CustomerPaymentMethodGetList = 'Customer/CustomerPaymentMethodGetList',
    CustomerPaymentInsert = 'Customer/CustomerPaymentInsert',
    CouponGetList = 'Coupon/CouponGetList'
}
