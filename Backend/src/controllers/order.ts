import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { reduceStock, revalidateCache } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";

export const newOrder = TryCatch(async (
    req: Request<{}, {}, NewOrderRequestBody>, 
    res, 
    next
) => {
    const { discount, orderItems, shippingCharges, shippingInfo, subTotal, tax, total, user } = req.body;

    if (!orderItems || !shippingInfo || !subTotal
        || !tax || !total || !user) {
        return next(new ErrorHandler("Please add all the fields", 400));
    }

    const order = await Order.create({
        discount, orderItems, shippingCharges, shippingInfo, subTotal, tax, total, user
    })

    await reduceStock(orderItems);
    await revalidateCache({
        product: true, 
        order: true, 
        admin: true, 
        userId: user,
        productId: order.orderItems.map(ele => String(ele.productId))
    });

    return res.status(201).json({
        success: true,
        message: "Order Placed Successfully"
    })
});


export const myOrders = TryCatch(async (req, res, next) => {
    const id = req.query.id;
    let orders = [];

    if(myCache.has(`my-orders-${id}`)) {
        orders = JSON.parse(myCache.get(`my-orders-${id}`) as string);
    } else {
        orders = await Order.find({ user: id })

        if(orders.length === 0) 
            return next(new ErrorHandler("Order Not Found", 404));

        myCache.set(`my-orders-${id}`, JSON.stringify(orders));
    }

    return res.status(200).json({ success: true, orders });
});


export const allOrders = TryCatch(async (req, res, next) => {
    let orders = [];

    if(myCache.has("all-orders")) {
        orders = JSON.parse(myCache.get("all-orders") as string);
    } else {
        orders = await Order.find().populate("user", "name");

        if(orders.length === 0) {
            return next(new ErrorHandler("No order is present", 404));
        }

        myCache.set("all-orders", JSON.stringify(orders));
    }

    return res.status(200).json({ success: true, orders });
});


export const getOrderById = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    let order;

    if(myCache.has(`order-${id}`)) {
        order = JSON.parse(myCache.get(`order-${id}`) as string);
    } else {
        order = await Order.findById(id).populate("user", "name");
        if(!order)
            return next(new ErrorHandler('Order not found', 404));

        myCache.set(`order-${id}`, JSON.stringify(order));
    }

    return res.status(200).json({ success: true, order });
});


export const processOrder = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const order = await Order.findById(id);

    if(!order)
        return next(new ErrorHandler('Order not found', 404));

    switch(order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }

    await order.save();

    await revalidateCache({product: false, order: true, admin: true, userId: order.user, orderId: String(order._id)});

    return res.status(200).json({ success: true, message: "Order Processed Successfully" });
})


export const deleteOrder = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const order = await Order.findByIdAndDelete(id);

    if(!order)
        return next(new ErrorHandler('Order not found', 404));

    await revalidateCache({product: false, order: true, admin: true, userId: order.user, orderId: String(order._id)});

    return res.status(200).json({ success: true, message: "Order Deleted Successfully" });
})