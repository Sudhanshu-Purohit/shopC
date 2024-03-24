import { FaPlus } from "react-icons/fa"
import { CartItems } from "../types/types"

interface ProductCardProps {
    productId: string,
    price: number,
    name: string,
    photo: string,
    stock: number,
    handler: (cartItem: CartItems) => string | undefined
}

const ProductCard = ({
    productId,
    price,
    name,
    photo,
    stock,
    handler
}: ProductCardProps) => {
    return (
        <div className="product-card">
            <img src={`http://localhost:4000/${photo}`} alt={name} />
            <p>{name}</p>
            <span>₹{price}</span>
            <div>
                <button onClick={() => handler({productId, price, name, photo, stock, quantity: 1})}>
                    <FaPlus />
                </button>
            </div>
        </div>
    )
}

export default ProductCard
