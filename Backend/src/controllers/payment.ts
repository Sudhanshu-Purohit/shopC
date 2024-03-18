import { TryCatch } from "../middlewares/error.js";
import { Coupoun } from "../models/coupoun.js";
import ErrorHandler from "../utils/utility-class.js";

export const createNewCoupoun = TryCatch(async (req, res, next) => {
    const { coupoun, amount } = req.body;
    if(!coupoun || !amount) 
        return next(new ErrorHandler("Please provide coupoun code or discount amount", 400));

    await Coupoun.create({
        coupounCode: coupoun,
        discount: amount
    })

    return res.status(201).json({
        success: true,
        message: "Coupoun Created Successfully"
    })
})


export const applyDiscount = TryCatch(async (req, res, next) => {
    const { coupoun } = req.query;
    if(!coupoun) return next(new ErrorHandler("please provide coupoun code", 400));

    const discount = await Coupoun.findOne({
        coupounCode: coupoun
    })

    if(!discount) return next(new ErrorHandler("Invalid coupoun code", 400));

    return res.status(200).json({
        success: true,
        discount: discount.discount
    })
})


export const getAllCoupouns = TryCatch(async (req, res, next) => {
    const coupouns = await Coupoun.find({});
    if(coupouns.length <= 0) {
        return next(new ErrorHandler("No coupoun is present", 400));
    }

    return res.status(200).json({
        success: true,
        coupouns
    })
})

export const deleteCoupoun = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    if(!id) return next(new ErrorHandler("please provide ID", 400));
    
    const coupoun = await Coupoun.findByIdAndDelete(id);
    if(!coupoun) return next(new ErrorHandler("Coupoun not found", 400));

    return res.status(200).json({
        success: true,
        message: "Coupoun deleted successfully"
    })
})