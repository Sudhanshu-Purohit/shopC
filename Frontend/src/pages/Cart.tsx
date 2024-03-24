import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemsCard from "../components/CartItems";
import { addToCart, calculateCartTotals, removeFromCart } from "../redux/reducer/cartReducer";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItems } from "../types/types";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, subTotal, tax, total, shippingCharges, discount } = useSelector((state: {cartReducer: CartReducerInitialState}) => state.cartReducer);

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItems) => {
    if(cartItem.quantity >= cartItem.stock) 
      return toast.error("Stock limit exceeded");

    dispatch(addToCart({...cartItem, quantity: cartItem.quantity + 1}));
  }

  const decrementHandler = (cartItem: CartItems) => {
    if(cartItem.quantity <= 1) return;
    dispatch(addToCart({...cartItem, quantity: cartItem.quantity - 1}));
  }

  const removeHandler = (id: string) => {
    dispatch(removeFromCart(id));
  }

  useEffect(() => {
    dispatch(calculateCartTotals());
  }, [cartItems])

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, i) => (
            <CartItemsCard 
              key={i} 
              cartItem = {item} 
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹{subTotal}</p>
        <p>Shipping charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>
        <input 
          type="text" 
          placeholder="Enter coupon code.."
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode && (
          isValidCouponCode ? (
            <span className="green">₹4389 off using the <code>{couponCode}</code></span>
          ) : (
            <span className="red"> Invalid Coupon <VscError /> </span>
          )
        )}

        {cartItems.length > 0 && (
          <Link to='/shipping'> Checkout </Link>
        )}
      </aside>
    </div>
  )
}

export default Cart
