import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"

const Home = () => {
  const addToCartHandler = () => {

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
          <ProductCard 
            productId="0427584"
            price={43423}
            name="macbook"
            photo="https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1685966368/Croma%20Assets/Computers%20Peripherals/Laptop/Images/256713_xqa1ds.png"
            stock={5}
            handler={addToCartHandler}
          />
        </main>
    </div>
  )
}

export default Home
