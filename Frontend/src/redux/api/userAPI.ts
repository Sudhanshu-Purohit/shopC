import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllUsersResponse, DeleteUserQuery, MessageResponse, UserResponse } from "../../types/api-types";
import axios from "axios";
import { User } from "../../types/types";

export const userAPI = createApi({
    reducerPath: "userAPI",
    baseQuery: fetchBaseQuery({baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/`}),
    tagTypes: ["users"],
    endpoints: (builder) => ({
        login: builder.mutation<MessageResponse, User>({
            query: (user) => ({
                url: "new",           //http://localhost:400/api/v1/user/new
                method: "POST",
                body: user,
            }),
            invalidatesTags: ["users"],
        }),
        deleteUser: builder.mutation<MessageResponse, DeleteUserQuery>({
            query: ({userId, adminId}) => ({
                url: `${userId}?id=${adminId}`,           
                method: "DELETE",
            }),
            invalidatesTags: ["users"],
        }),
        allUsers: builder.query<AllUsersResponse, string>({
            query: (id) => ({
                url: `all-users?id=${id}`,           
                method: "GET",
            }),
            providesTags: ["users"]
        })
    })
})

export const getUser = async (id: string) => {
    try {
        const { data }: {data: UserResponse} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${id}`);

        return data;
    } catch (error) {
        throw error;
    }
}

export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation } = userAPI;