import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse, User } from "../../types/api-types";

export const userAPI = createApi({
    reducerPath: "userAPI",
    baseQuery: fetchBaseQuery({baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/`}),
    endpoints: (builder) => ({
        login: builder.mutation<MessageResponse, User>({
            query: (user) => ({
                url: "new",           //http://localhost:400/api/v1/user/new
                method: "POST",
                body: user,
            })
        })
    })
})

export const { useLoginMutation } = userAPI;