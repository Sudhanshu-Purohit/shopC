import { useState } from "react"
import { VscError } from "react-icons/vsc";
import CartItems from "../components/CartItems";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "74850734",
    photo: "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1685966368/Croma%20Assets/Computers%20Peripherals/Laptop/Images/256713_xqa1ds.png",
    name: "Macbook",
    price: 78234,
    quantity: 10,
    stock: 30
  },
  {
    productId: "74850734",
    photo: "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1685966368/Croma%20Assets/Computers%20Peripherals/Laptop/Images/256713_xqa1ds.png",
    name: "Macbook",
    price: 78234,
    quantity: 10,
    stock: 30
  },
  {
    productId: "74850734",
    photo: "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1685966368/Croma%20Assets/Computers%20Peripherals/Laptop/Images/256713_xqa1ds.png",
    name: "Macbook",
    price: 78234,
    quantity: 10,
    stock: 30
  },
  {
    productId: "74850734",
    photo: "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1685966368/Croma%20Assets/Computers%20Peripherals/Laptop/Images/256713_xqa1ds.png",
    name: "Macbook",
    price: 78234,
    quantity: 10,
    stock: 30
  }
]

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, i) => (
            <CartItems key={i} cartItem = {item} />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹8434</p>
        <p>Shipping charges: ₹8434</p>
        <p>Tax: ₹8434</p>
        <p>
          Discount: <em className="red"> - ₹4903</em>
        </p>
        <p>
          <b>Total: ₹9043</b>
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
