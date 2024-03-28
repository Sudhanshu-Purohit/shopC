import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateCoupounQuery, MessageResponse } from "../../types/api-types";

export const PaymentAPI = createApi({
    reducerPath: "PaymentAPI",
    baseQuery: fetchBaseQuery({baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/`}),
    endpoints: (builder) => ({
        createCoupoun: builder.mutation<MessageResponse, CreateCoupounQuery>({
            query: ({data, userId}) => ({
                url: `coupoun/new?id=${userId}`,           
                method: "POST",
                body: data
            }),
        }),
    })
})

export const { useCreateCoupounMutation } = PaymentAPI;