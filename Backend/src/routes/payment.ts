import express from 'express';
import { applyDiscount, createNewCoupoun, deleteCoupoun, getAllCoupouns } from '../controllers/payment.js';
import { adminOnly } from '../middlewares/auth.js';
const app = express.Router();

app.post('/coupoun/new', adminOnly, createNewCoupoun)
app.get('/apply/discount', applyDiscount)
app.get('/all/coupouns', adminOnly, getAllCoupouns)
app.delete('/coupoun/delete/:id', adminOnly, deleteCoupoun)

export default app;