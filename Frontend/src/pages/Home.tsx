import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import toast from "react-hot-toast";
import { SkeletonLoader } from "../components/Loader";
import { CartItems } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Home = () => {
  const { data, isLoading, isError  } = useLatestProductsQuery("");
  const dispatch = useDispatch();

  if(isError) {
    toast.error("Error fetching the products");
  }

  const addToCartHandler = (cartItem: CartItems) => { 
    if(cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Item added to cart");
  }

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to='/search' className="findmore">
          More
        </Link>
      </h1>
      <main>
        {
          isLoading ? <SkeletonLoader /> : data?.products.map((product, i) => {
            return <ProductCard
              key={i}
              productId={product._id}
              price={product.price}
              name={product.name}
              photo={product.photo}
              stock={product.stock}
              handler={addToCartHandler}
            />
          })
        }
      </main>
    </div>
  )
}

export default Home
