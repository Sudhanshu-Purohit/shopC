import express from 'express';
import { deleteUser, getAllUsers, getUserById, newUser } from '../controllers/user.js';
import { adminOnly } from '../middlewares/auth.js';
const app = express.Router();

app.post("/new", newUser);
app.get("/all-users", adminOnly, getAllUsers);

// as the route in both below is same so we can chain them in one
// app.get("/:id", getUserById);
// app.delete("/:id", deleteUser);
app.route('/:id').get(getUserById).delete(adminOnly, deleteUser);

export default app;