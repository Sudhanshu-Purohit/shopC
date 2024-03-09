import express from 'express';
import { connectDB } from './config/db.js';
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from 'node-cache';

// importing routes
import userRoute from './routes/user.js';
import productRoute from './routes/product.js';

// database connection
connectDB();

// for using chacheing
export const myCache = new NodeCache({
    stdTTL: 1800  // after this time the cache will be removed from memory
});

const PORT = 4000;

const app = express();
app.use(express.json());

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)

// making the uploads folder static so that we can access the images in frontnd from url
app.use('/uploads', express.static("uploads"));
// middleware for error handling --> it is used in the bottom
app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`server is running at: https://localhost:${PORT}`);
});