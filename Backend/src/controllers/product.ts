import express, { Request } from 'express';
import { TryCatch } from '../middlewares/error.js';
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from '../types/types.js';
import { Product } from '../models/product.js';
import ErrorHandler from '../utils/utility-class.js';
import { rm } from 'fs';
import { myCache } from '../app.js';
import { revalidateCache } from '../utils/features.js';

export const newProduct = TryCatch(async (
    req: Request<{}, {}, NewProductRequestBody>, 
    res, 
    next
) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if(!photo)
        return next(new ErrorHandler("Please add photo", 400));

    if(!name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log("photo deleted");
        })
        
        return next(new ErrorHandler("Please fill all fields", 400))
    }

    await Product.create({
        name,
        price,
        stock,
        photo: photo?.path,
        category: category.toLowerCase()
    });

    // after creating the product revalidating cache
    await revalidateCache({product: true, admin: true,});

    return res.status(201).json({
        success: true,
        message: 'Product created successfully'
    })
})


// revalidate on create product, delete, update and on new order
export const getLatestProducts = TryCatch(async (req, res, next) => {

    let products = [];
    // checking if latest products is present in cache memory
    if(myCache.has("latest-products")) {
        products = JSON.parse(myCache.get("latest-products") as string);
    } else {
        products = await Product.find({}).sort({createdAt: -1}).limit(5); // 1 -> asc order, -1 --> desc order

        if(products.length <= 0) 
            return next(new ErrorHandler("No products found", 404));

        // caching latest products
        myCache.set("latest-products", JSON.stringify(products));
    }
    
    return res.status(200).json({
        success: true,
        products
    })
})


// revalidate on create product, delete, update and on new order
export const getAllCategories = TryCatch(async (req, res, next) => {

    let categories = [];
    if(myCache.has("all-categories")) {
        categories = JSON.parse(myCache.get("all-categories") as string);
    } else {
        categories = await Product.distinct("category");

        if(categories.length <= 0) 
            return next(new ErrorHandler("No categories found", 404));

        myCache.set("all-categories", JSON.stringify(categories));
    }

    return res.status(200).json({
        success: true,
        categories
    })
})


// revalidate on create product, delete, update and on new order
export const getAdminProducts = TryCatch(async (req, res, next) => {
    let products = [];
    if(myCache.has("admin-products")) {
        products = JSON.parse(myCache.get("admin-products") as string);
    } else {
        products = await Product.find({})

        if(products.length <= 0) 
            return next(new ErrorHandler("No products found", 404));

        myCache.set("admin-products", JSON.stringify(products));
    }

    return res.status(200).json({
        success: true,
        products
    })
})

// revalidate on create product, delete, update and on new order
export const getProductById = TryCatch(async (req, res, next) => {
    let product;
    const id = req.params.id;

    if(myCache.has(`product-${id}`)) {
        product = JSON.parse(myCache.get(`product-${id}`) as string);
    } else {
        product = await Product.findById(id);    
            
        if(!product) 
            return next(new ErrorHandler("Product not found", 404));

        myCache.set(`product-${id}`, JSON.stringify(product));
    }

    return res.status(200).json({
        success: true,
        product
    })
})

export const updateProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    const product = await Product.findById(id);
    if(!product)
        return next(new ErrorHandler("Product not found", 404));

    if (photo) {
        rm(product.photo, () => {
            console.log('old photo deleted');
        })
        product.photo = photo.path;
    }

    if(name) product.name = name;
    if(price) product.price = price;
    if(stock) product.stock = stock;
    if(category) product.category = category;
    
    await product.save();

    // after updating the product revalidating cache
    await revalidateCache({product: true, admin: true, productId: String(product._id)});

    return res.status(200).json({
        success: true,
        message: "Product updated successfully"
    })
})


export const deleteProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;

    const product = await Product.findByIdAndDelete(id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    rm(product.photo, () => {
        console.log('product photo deleted');
    })

    // after deleting the product revalidating cache
    await revalidateCache({product: true, admin: true, productId: String(product._id)});

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})


export const searchAllProducts = TryCatch(async (
    req: Request<{}, {}, {}, SearchRequestQuery>, 
    res, 
    next
) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page-1)*limit;

    const baseQuery: BaseQuery = {};

    if(search) {
        baseQuery.name = {
            $regex: search,
            $options: 'i'
        }
    }

    if(price) {
        baseQuery.price = {
            $lte: Number(price),
        }
    }

    if(category) {
        baseQuery.category = category;
    }

    // const products = await Product.find(baseQuery).sort(
    //     sort && { price: sort === 'asc' ? 1 : -1 }
    // ).limit(limit).skip(skip);

    // for finding total pages --> but there is a problem in this first we are finding products above and then we are again finding products so we can optimize this using promise.all
    // const filteredProducts = await Product.find({baseQuery});
    // const totalPages = Math.ceil(filteredProducts.length / limit);

    const [products, filteredProducts] = await Promise.all([
        Product.find(baseQuery).sort(
            sort && { price: sort === 'asc' ? 1 : -1 }
        ).limit(limit).skip(skip),

        Product.find(baseQuery),
    ])

    const totalPages = Math.ceil(filteredProducts.length / limit);

    return res.status(200).json({
        success: true,
        products,
        totalPages
    });
})