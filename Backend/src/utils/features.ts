import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { OrderItemType, RevalidateCacheProps } from "../types/types.js";
import { Document } from 'mongoose'

export const revalidateCache = async ({
    admin,
    order,
    product,
    userId,
    orderId,
    productId,
}: RevalidateCacheProps) => {
    if(product) {
        const productKeys: string[] = ["latest-products", "all-categories", "admin-products"];
        
        if(typeof productId === 'string') 
            productKeys.push(`product-${productId}`);

        if(typeof productId === 'object') 
            productId.forEach(ele => productKeys.push(`product-${ele}`));

        myCache.del(productKeys);
    }

    if(order) {
        const orderKeys: string[] = ["all-orders", `my-orders-${userId}`, `order-${orderId}`]
        myCache.del(orderKeys);
    }

    if(admin) {

    }
}


export const reduceStock = async (orderItems: OrderItemType[]) => {
    orderItems.forEach(async (ele, i) => {
        const product = await Product.findById(ele.productId);
        if(!product)
            throw new Error("Product not found");

        product.stock -= ele.quantity;
        await product.save();
    });
}


export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
    if(lastMonth === 0) {
        return thisMonth*100;
    }

    const percentage = (thisMonth / lastMonth) * 100;
    return Number(percentage.toFixed(0));
}


export const getCategories = async (allCategories: string[], productsCount: number) => {

    const categoriesCountPromise = allCategories.map((category) => {
        return Product.countDocuments({ category })
    })

    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount: Record<string, number>[] = [];

    if (allCategories.length > 0) {
        allCategories.forEach((category, i) => {
            categoryCount.push({
                [category]: Math.round((categoriesCount[i] / productsCount) * 100)
            })
        })
    }

    return categoryCount;
}


interface MyDocument extends Document {
    createdAt: Date
}

type countProps = {
    docArr: MyDocument[],
    length: number,
    today: Date
}

export const count = ({ docArr, length, today }: countProps) => {
    const data = new Array(length).fill(0);

    docArr.forEach((ele, i) => {
        const creationDate = ele.createdAt;
        const monthDiff = today.getMonth() - creationDate.getMonth();

        if (monthDiff < length) {
            data[length - 1 - monthDiff] += 1;
        }
    })

    return data;
}