import mongoose from "mongoose";

const schema = new mongoose.Schema({
    coupounCode: {
        type: String,
        unique: true,
        required: [true, 'Please enter coupon code']
    }, 
    discount: {
        type: Number,
        required: [true, 'Please enter discount amount']
    }
}, {
    timestamps: true,
})

export const Coupoun = mongoose.model("Coupoun", schema);