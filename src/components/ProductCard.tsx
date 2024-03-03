import { FaPlus } from "react-icons/fa"

interface ProductCardProps {
    productId: string,
    price: number,
    name: string,
    photo: string,
    stock: number,
    handler: () => void
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
            <img src={photo} alt={name} />
            <p>{name}</p>
            <span>${price}</span>
            <div>
                <button onClick={() => handler()}>
                    <FaPlus />
                </button>
            </div>
        </div>
    )
}

export default ProductCard
