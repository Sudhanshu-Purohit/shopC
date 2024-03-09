import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect("mongodb+srv://sudhanshu:ALX1yW3XfAnU1hO6@shopc-cluster.hz3mmiw.mongodb.net/?retryWrites=true&w=majority&appName=ShopC-Cluster", {
        dbName: "shopC",
    }).then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
}