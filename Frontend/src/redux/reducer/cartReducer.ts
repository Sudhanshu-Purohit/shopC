import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItems, ShippingInfo } from "../../types/types";

const initialState: CartReducerInitialState = {
    loading: false,
    cartItems: [],
    subTotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    shippingInfo: {
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: ""
    }
};

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItems>) => {
            state.loading = true;
            const index = state.cartItems.findIndex(item => item.productId === action.payload.productId);
            if(index !== -1) {
                state.cartItems[index] = action.payload;
            } else {
                state.cartItems.push(action.payload);
            }
            state.loading = false;
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter((cartItem) => cartItem.productId !== action.payload);
            state.loading = false;
        },
        calculateCartTotals: (state) => {
            const subTotal = state.cartItems.reduceRight((subTotal, item) => {
                return subTotal + (item.quantity*item.price);
            }, 0);

            state.subTotal = subTotal;
            if(state.cartItems.length > 0) {
                state.shippingCharges = state.subTotal > 600 ? 0: 40;
            } else {
                state.shippingCharges = 0;
            }
            state.tax = Math.round(state.subTotal * 0.05);
            state.total = state.subTotal + state.tax + state.shippingCharges - state.discount;
        },
        applyDiscount: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        },
        saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
            state.shippingInfo = action.payload;
        }, 
        resetCart: () => initialState
    }
})

export const { addToCart, removeFromCart, calculateCartTotals, applyDiscount, saveShippingInfo, resetCart } = cartReducer.actions;