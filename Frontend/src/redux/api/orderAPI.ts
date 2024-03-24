import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllOrdersResponse, MessageResponse, NewOrderQuery, OrderDetailsResponse, UpdateOrderQuery } from "../../types/api-types";

export const orderAPI = createApi({
    reducerPath: "orderAPI",
    baseQuery: fetchBaseQuery({baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/order/`}),
    tagTypes: ["orders"],
    endpoints: (builder) => ({
        createOrder: builder.mutation<MessageResponse, NewOrderQuery>({
            query: (order) => ({
                url: "new",           //http://localhost:400/api/v1/order/new
                method: "POST",
                body: order
            }),
            invalidatesTags: ["orders"]
        }),
        updateOrder: builder.mutation<MessageResponse, UpdateOrderQuery>({
            query: ({userId, orderId}) => ({
                url: `${orderId}?id=${userId}`,  //http://localhost:400/api/v1/order/orderid?id=userid
                method: "PUT"
            }),
            invalidatesTags: ["orders"]
        }),
        deleteOrder: builder.mutation<MessageResponse, UpdateOrderQuery>({
            query: ({userId, orderId}) => ({
                url: `${orderId}?id=${userId}`,  //http://localhost:400/api/v1/order/orderid?id=userid
                method: "DELETE"
            }),
            invalidatesTags: ["orders"]
        }),
        myOrders: builder.query<AllOrdersResponse, string>({
            query: (id) => ({
                url: `my?id=${id}`,           //http://localhost:400/api/v1/order/my?id=
                method: "GET",
            }),
            providesTags: ["orders"]
        }),
        allOrders: builder.query<AllOrdersResponse, string>({
            query: (id) => ({
                url: `all?id=${id}`,           //http://localhost:400/api/v1/order/all?id=
                method: "GET",
            }),
            providesTags: ["orders"]
        }),
        orderDetails: builder.query<OrderDetailsResponse, string>({
            query: (id) => ({
                url: id,           //http://localhost:400/api/v1/order/id
                method: "GET",
            }),
            providesTags: ["orders"]
        })
    })
})

export const { useCreateOrderMutation, useUpdateOrderMutation, useDeleteOrderMutation, useMyOrdersQuery, useAllOrdersQuery, useOrderDetailsQuery } = orderAPI;