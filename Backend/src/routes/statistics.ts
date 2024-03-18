import express from 'express';
import { getBarChartStats, getDashboardStats, getLineChartStats, getPieChartStats } from '../controllers/statistics.js';
import { adminOnly } from '../middlewares/auth.js';
const app = express.Router();

app.get('/stats', adminOnly, getDashboardStats)
app.get('/pie', adminOnly, getPieChartStats)
app.get('/bar', adminOnly, getBarChartStats)
app.get('/line', adminOnly, getLineChartStats)

export default app;