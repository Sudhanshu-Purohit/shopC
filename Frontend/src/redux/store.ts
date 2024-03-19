import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userAPI.middleware)
})