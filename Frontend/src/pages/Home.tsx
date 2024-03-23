import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import toast from "react-hot-toast";
import { SkeletonLoader } from "../components/Loader";

const Home = () => {
  const { data, isLoading, isError  } = useLatestProductsQuery("");

  if(isError) {
    toast.error("Error fetching the products");
  }

  const addToCartHandler = () => { }

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
