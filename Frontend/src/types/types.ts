export type User = {
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    dob: string;
    _id: string
}

export type Product = {
    _id: string;
    name: string;
    photo: string;
    price: number;
    stock: number;
    category: string;
}

export type ShippingInfo = {
    address: string,
    city: string,
    state: string,
    country: string,
    pinCode: string,
}

export type CartItems = {
    productId: string;
    photo: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
}

export type OrderItem = Omit<CartItems, "stock"> & {
    _id: string;
}

export type Order = {
    shippingInfo: ShippingInfo,
    orderItems: OrderItem[],
    total: number,
    discount: number,
    tax: number,
    subTotal: number,
    shippingCharges: number,
    status: string,
    _id: string,
    user: {
        name: string,
        _id: string,
    }
}

type CountAndPercentageChange = {
    revenue: number;
    product: number;
    user: number;
    order: number;
}

type LatestTransaction = {
    _id: string;
    amount: number;
    discount: number;
    quantity: number;
    status: string;
}

export type Stats = {
    categoryCount: Record<string, number>[];
    percentageChange: CountAndPercentageChange;
    count: CountAndPercentageChange;
    chart: {
        order: number[];
        revenue: number[]
    };
    userRatio: {
        male: number;
        female: number;
    };
    latestTransactions: LatestTransaction[];
}

export type Pie = {
    orderFullfilment: {
        processingOrdersCount: number;
        shippedOrdersCount: number;
        deliveredOrdersCount: number;
    },
    categoryCount: Record<string, number>[];
    stockAvailablity: {
        inStock: number;
        outOfStock: number;
    },
    revenueDistribution: {
        netMargin: number;
        marketingCost: number;
        burnt: number;
        productionCost: number;
        grossDiscount: number;
    },
    users: {
        admin: number,
        customers: number,
    },
    userAgeGroup: {
        teen: number,
        adult: number,
        old: number
    }
}

export type Bar = {
    lastSixMonthProductsCount: number[];
    lastSixMonthUsersCount: number[];
    lastTwelveMonthOrdersCount: number[];
}

export type Line = {
    lastTwelveMonthProductsCount: number[];
    lastTwelveMonthUsersCount: number[];
    lastTwelveMonthDiscount: number[];
    lastTwelveMonthRevenue: number[];
}