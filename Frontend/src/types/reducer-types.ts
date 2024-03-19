import { User } from "./api-types";

export interface UserReducerInitialState {
    user: User | null,
    loading: boolean,
}