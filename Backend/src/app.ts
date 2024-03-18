import express from 'express';
import { connectDB } from './config/db.js';
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from 'node-cache';
import { config } from 'dotenv';
config({ path: './.env' });

// importing routes
import userRoute from './routes/user.js';
import productRoute from './routes/product.js';
import orderRoute from './routes/order.js';
import paymentRoute from './routes/payment.js';
import dashboardRoute from './routes/statistics.js';
import morgan from 'morgan';

// database connection
const mongodb_uri = process.env.MONGODB_URI || "mongodb+srv://sudhanshu:ALX1yW3XfAnU1hO6@shopc-cluster.hz3mmiw.mongodb.net/?retryWrites=true&w=majority&appName=ShopC-Cluster"
connectDB(mongodb_uri);

// for using chacheing
export const myCache = new NodeCache({
    stdTTL: 1800  // after this time the cache will be removed from memory
});

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
// morgan is used for logging http requests
app.use(morgan("dev"));

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/order', orderRoute)
app.use('/api/v1/payment', paymentRoute)
app.use('/api/v1/dashboard', dashboardRoute)

// making the uploads folder static so that we can access the images in frontnd from url
app.use('/uploads', express.static("uploads"));
// middleware for error handling --> it is used in the bottom
app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`server is running at: https://localhost:${PORT}`);
});