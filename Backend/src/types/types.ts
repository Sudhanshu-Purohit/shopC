import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export interface NewUserRequestBody {
    name: string;
    email: string;
    photo: string;
    gender: string;
    _id: string;
    dob: Date
}

export interface NewProductRequestBody {
    name: string;
    category: string;
    price: number;
    stock: number
}

export type SearchRequestQuery = {
    search?: string;
    price?: string;
    category?: string;
    sort?: string;
    page?: string;
}

export type ControllerType = (
    req: Request,
    res: Response, 
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>


export interface BaseQuery {
    name?: {
        $regex?: string;
        $options?: string;
    };
    price?: {
        $lte: number;
    };
    category?: string;
}


export type RevalidateCacheProps = {
    product?: boolean;
    order?: boolean;
    admin?: boolean;
    userId?: string;
    orderId?: string;
    productId?: string | string[];
}

export interface NewOrderRequestBody {
    shippingInfo: shippingInfoType,
    user: string,
    subTotal: number,
    tax: number,
    shippingCharges: number,
    discount: number,
    total: number,
    orderItems: OrderItemType[]
}

export type OrderItemType = {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId: string
}

export type shippingInfoType = {
    address: string; 
    city: string;
    state: string;
    country: string;
    pinCode: number;
}