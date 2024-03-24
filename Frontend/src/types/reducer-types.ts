import { CartItems, ShippingInfo, User } from "./types";

export interface UserReducerInitialState {
    user: User | null,
    loading: boolean,
}

export type CartReducerInitialState = {
    loading: boolean;
    cartItems: CartItems[];
    subTotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    shippingInfo: ShippingInfo
}