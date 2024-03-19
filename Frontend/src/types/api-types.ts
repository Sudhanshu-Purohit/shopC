export interface User {
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    dob: string;
    _id: string
}

export type MessageResponse = {
    success: boolean;
    message: string;
}