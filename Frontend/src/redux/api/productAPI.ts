import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse, CategoriesResponse, DeleteProductQuery, MessageResponse, NewProductQuery, ProductResponse, SearchProductsQuery, SearchProductsResponse, UpdateProductQuery } from "../../types/api-types";

export const productAPI = createApi({
    reducerPath: "productAPI",
    baseQuery: fetchBaseQuery({baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/product/`}),
    tagTypes: ["product"], // Rtk query caches the data so this tag is for invalidation
    endpoints: (builder) => ({
        latestProducts: builder.query<AllProductsResponse, string>({
            query: () => ({
                url: "latest",          //http://localhost:400/api/v1/product/latest
                method: "GET",
            }),
            providesTags: ["product"]
        }),
        allProducts: builder.query<AllProductsResponse, string>({
            query: (id) => ({
                url: `admin-products?id=${id}`,      //http://localhost:400/api/v1/product/admin-products
                method: "GET",
            }),
            providesTags: ["product"]
        }),
        categories: builder.query<CategoriesResponse, string>({
            query: () => ({
                url: "categories",                   //http://localhost:400/api/v1/product/categories
                method: "GET"
            }),
            providesTags: ["product"]
        }),
        searchProducts: builder.query<SearchProductsResponse, SearchProductsQuery>({
            query: ({price, search, sort, page, category}) => {
                let baseQuery = `all?search=${search}&page=${page}`;
                if(price) baseQuery += `&price=${price}`;
                if(sort) baseQuery += `&sort=${sort}`;
                if(category) baseQuery += `&category=${category}`

                return baseQuery;
            },
            providesTags: ["product"]
        }),
        singleProductDetails: builder.query<ProductResponse, string>({
            query: (id) => ({
                url: id,                   //http://localhost:400/api/v1/product/id
                method: "GET"
            }),
            providesTags: ["product"]
        }),
        createProduct: builder.mutation<MessageResponse, NewProductQuery>({
            query: ({id, formData}) => ({
                url: `new?id=${id}`,            // http://localhost:4000/api/v1/product/new?id=4089320
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ["product"]
        }),
        updateProduct: builder.mutation<MessageResponse, UpdateProductQuery>({
            query: ({userId, productId, formData}) => ({
                url: `${productId}?id=${userId}`,   // http://localhost:4000/api/v1/product/productid?id=4089320
                method: 'PUT',
                body: formData
            }),
            invalidatesTags: ["product"]
        }),
        deleteProduct: builder.mutation<MessageResponse, DeleteProductQuery>({
            query: ({userId, productId}) => ({
                url: `${productId}?id=${userId}`,   // http://localhost:4000/api/v1/product/productid?id=4089320
                method: 'DELETE',
            }),
            invalidatesTags: ["product"]
        })
    })
})


export const { useLatestProductsQuery, useAllProductsQuery, useCategoriesQuery, useSearchProductsQuery, useCreateProductMutation, useSingleProductDetailsQuery, useUpdateProductMutation, useDeleteProductMutation } = productAPI;