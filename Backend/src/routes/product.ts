import express from 'express';
import { deleteProduct, getAdminProducts, getAllCategories, getLatestProducts, getProductById, newProduct, searchAllProducts, updateProduct } from '../controllers/product.js';
import { singleUpload } from '../middlewares/multer.js';
import { adminOnly } from '../middlewares/auth.js';
const app = express.Router();

app.post('/new', adminOnly, singleUpload, newProduct);
app.get('/latest', getLatestProducts);
app.get('/categories', getAllCategories);
app.get('/admin-products', adminOnly, getAdminProducts);
// to get all products with filtering
app.get('/all', searchAllProducts);


// as the route below are same so we can chain them in one
// app.get('/:id', getProductById);
// app.put('/:id', singleUpload, updateProduct);
// app.delete('/:id', deleteProduct);
app.route('/:id')
    .get(getProductById)
    .put(adminOnly, singleUpload, updateProduct)
    .delete(adminOnly, deleteProduct);

export default app;