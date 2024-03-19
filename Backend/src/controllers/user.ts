import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = TryCatch(
    async (
        req: Request<{}, {}, NewUserRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        const { name, email, photo, gender, _id, dob, role } = req.body;

        if(!name || !email || !photo || !gender || !_id || !dob) {
            return next(new ErrorHandler("Please add all the fields", 400));
        }
        
        // if user already exists in db
        let user = await User.findById(_id);

        if(user) {
            return res.status(201).json({
                success: false,
                message: "User already exists"
            })
        }

        user = await User.create({ name, email, photo, gender, _id, dob: new Date(dob), role });

        return res.status(201).json({
            success: true,
            message: `Welcome! ${user.name}`
        })
    }
);

export const getAllUsers = TryCatch(async (req, res, next) => {
    // it will find all the users
    const users = await User.find({});

    return res.status(200).json({ success: true, users })
})

export const getUserById = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    
    const user = await User.findById(id);

    if(!user)
        return next(new ErrorHandler("User not found", 400));

    return res.status(200).json({ success: true, user })
})

export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    
    const user = await User.findByIdAndDelete(id);

    if(!user)
        return next(new ErrorHandler("User not found", 400));

    return res.status(200).json({ success: true, message: 'User deleted successfully' })
})