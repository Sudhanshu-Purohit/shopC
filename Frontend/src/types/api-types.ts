import { Product, User } from "./types";

export type CustomError = {
    status: number;
    data: { 
        success: boolean;
        message: string
    }
}

export type MessageResponse = {
    success: boolean;
    message: string;
}

export type UserResponse = {
    success: boolean;
    user: User;
}

export type AllProductsResponse = {
    success: boolean;
    products: Product[];
}

export type CategoriesResponse = {
    success: boolean;
    categories: string[];
}

export type SearchProductsResponse = {
    success: boolean;
    products: Product[];
    totalPages: number;
}

export type SearchProductsQuery = {
    search: string;
    sort: string;
    price: number;
    category: string;
    page: number;
}

export type NewProductQuery = {
    id: string,
    formData: FormData;
}

export type UpdateProductQuery = {
    userId: string;
    productId: string;
    formData: FormData;
}

export type DeleteProductQuery = {
    userId: string;
    productId: string;
}

export type ProductResponse = {
    success: boolean;
    product: Product
}