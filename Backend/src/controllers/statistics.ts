import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats = {};

    if(myCache.has('admin-stats')) {
        stats = JSON.parse(myCache.get('admin-stats') as string)
    } else {
        const today = new Date();
        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
        
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today
        }

        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0)
        }

        const thisMonthProductsPromise = Product.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });

        const lastMonthProductsPromise = Product.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end
            }
        });

        const thisMonthUsersPromise = User.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });

        const lastMonthUsersPromise = User.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end
            }
        });

        const thisMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });

        const lastMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end
            }
        });

        const lastSixMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: sixMonthAgo,
                $lte: today
            }
        })

        // latest 4 transactions
        const latestTransactionsPromise = Order.find({}).select(["orderItems", "discount", "total", "status"]).limit(4);

        const [
            thisMonthProducts, lastMonthProducts, thisMonthUsers,
            lastMonthUsers, thisMonthOrders, lastMonthOrders, 
            lastSixMonthOrders, productsCount, usersCount, allOrders, allCategories, femaleUserCount, latestTransactions
        ] = await Promise.all([
            thisMonthProductsPromise,
            lastMonthProductsPromise,
            thisMonthUsersPromise,
            lastMonthUsersPromise,
            thisMonthOrdersPromise,
            lastMonthOrdersPromise,
            lastSixMonthOrdersPromise,
            Product.countDocuments(),  // count document is used to find total products
            User.countDocuments(), // count document is used to find to total users
            Order.find({}).select("total"), // it will find all orders and will return only selected field
            Product.distinct("category"), // it will give all distinct categories
            User.countDocuments({ gender: "female"} ),
            latestTransactionsPromise
        ]);

        const thisMonthRevenue = thisMonthOrders.reduce((totalRevenue, order) => {
            return totalRevenue + order.total;
        }, 0)

        const lastMonthRevenue = lastMonthOrders.reduce((totalRevenue, order) => {
            return totalRevenue + order.total;
        }, 0)

        const percentageChange = {
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),

            product: calculatePercentage(
                thisMonthProducts.length, lastMonthProducts.length
            ),

            user: calculatePercentage(
                thisMonthUsers.length, lastMonthUsers.length
            ), 

            order: calculatePercentage(
                thisMonthOrders.length, lastMonthOrders.length
            )
        }

        const totalRevenue = allOrders.reduce((totalRevenue, order) => {
            return totalRevenue + order.total;
        }, 0)

        const count = {
            user: usersCount,
            product: productsCount,
            order: allOrders.length
        }

        // last six month order counts and last six months total revenue
        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthlyRevenue = new Array(6).fill(0);

        lastSixMonthOrders.forEach((order, i) => {
            const creationDate = order.createdAt;
            const monthDiff = today.getMonth() - creationDate.getMonth();

            if(monthDiff < 6) {
                orderMonthCounts[6-1-monthDiff] += 1;
                orderMonthlyRevenue[6-1-monthDiff] += order.total;
            }
        })

        const categoriesCountPromise = allCategories.map((category) => {
            return Product.countDocuments({category})
        })

        const categoriesCount = await Promise.all(categoriesCountPromise);

        const categoryCount: Record<string, number>[] = [];

        if(allCategories.length > 0) {
            allCategories.forEach((category, i) => {
                categoryCount.push({
                    [category]: Math.round((categoriesCount[i] / productsCount) * 100)
                })
            })
        }

        const userRatio = {
            male: usersCount - femaleUserCount,
            female: femaleUserCount
        }

        const modifiedLatestTransactions: Record<number, number>[] = latestTransactions.map((ele, i) => {
            return {
                _id: ele._id,
                discount: ele.discount,
                amount: ele.total,
                status: ele.status,
                quantity: ele.orderItems.length
            }
        })

        stats = { 
            categoryCount,
            percentageChange,
            count,
            chart: {
                order: orderMonthCounts,
                revenue: orderMonthlyRevenue
            },
            userRatio,
            latestTransactions: modifiedLatestTransactions
        }

        myCache.set('admin-stats', JSON.stringify(stats));
    }

    return res.status(200).json({
        success: true,
        stats
    })
})



export const getPieChartStats = TryCatch(async (req, res, next) => {
    let charts = {};

    if(myCache.has('pieChart-stats')) {
        charts = JSON.parse(myCache.get('pieChart-stats') as string)
    } else {
        const [processingOrdersCount, shippedOrdersCount, deliveredOrdersCount] = await Promise.all([
            Order.countDocuments({status: "Processing"}),
            Order.countDocuments({status: "Shipped"}),
            Order.countDocuments({status: "Delivered"}),
        ]);

        const orderFullfilment = {
            processingOrdersCount,
            shippedOrdersCount,
            deliveredOrdersCount
        }

        charts = {
            orderFullfilment
        }

        myCache.set('pieChart-stats', JSON.stringify(charts));
    }

    return res.status(200).json({
        success: true,
        charts
    });
})



export const getBarChartStats = TryCatch(async (req, res, next) => {
    
})



export const getLineChartStats = TryCatch(async (req, res, next) => {
    
})