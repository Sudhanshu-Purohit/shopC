export interface User {
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    dob: string;
    _id: string
}

export interface Product {
    _id: string;
    name: string;
    photo: string;
    price: number;
    stock: number;
    category: string;
}

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