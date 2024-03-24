import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItems } from "../types/types";

interface cartItemsPorps {
    cartItem: CartItems,
    incrementHandler: (cartItem: CartItems) => void,
    decrementHandler: (cartItem: CartItems) => void,
    removeHandler: (id: string) => void,
}

const CartItems = ({
    cartItem,
    incrementHandler,
    decrementHandler,
    removeHandler
}: cartItemsPorps) => {
    const { photo, productId, name, price, quantity, stock } = cartItem;
    return (
        <div className="cart-item">
            <img src={`${import.meta.env.VITE_BACKEND_URL}/${photo}`} alt={name} />
            <article>
                <Link to={`/product/${productId}`}> {name} </Link>
                <span>₹{price}</span>
            </article>

            <div>
                <button onClick={() => decrementHandler(cartItem)}> - </button>
                <p> {quantity} </p>
                <button onClick={() => incrementHandler(cartItem)}> + </button>
            </div>

            <button onClick={() => removeHandler(productId)}> <FaTrash /> </button>
        </div>
    )
}

export default CartItems
