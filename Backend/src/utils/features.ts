import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { RevalidateCacheProps } from "../types/types.js";

export const revalidateCache = async ({
    admin,
    order,
    product
}: RevalidateCacheProps) => {
    if(product) {
        const productKeys: string[] = ["latest-products", "all-categories", "admin-products"];
        const productsId = await Product.find({}).select("_id");

        productsId.forEach((ele, i) => {
            productKeys.push(`product-${ele._id}`)
        })

        myCache.del(productKeys);
    }

    if(order) {

    }

    if(admin) {

    }
}