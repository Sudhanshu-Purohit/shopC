import { useState } from "react"
import ProductCard from "../components/ProductCard";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import { SkeletonLoader } from "../components/Loader";

const Search = () => {
  const { data, isLoading, isError, error } = useCategoriesQuery("");
  if (isError) {
    toast.error((error as CustomError).data.message);
  }

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const {data: searchedData, isLoading: productLoading, isError: isProductError, error: productError} = useSearchProductsQuery({
    search,
    sort,
    price: maxPrice,
    category,
    page,
  });

  if (isProductError) {
    toast.error((productError as CustomError).data.message);
  }

  const addToCartHandler = () => {

  }

  const isPrevPage = page > 1;
  const isNextPage = page < searchedData?.totalPages;

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || 100000}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {!isLoading && data?.categories.map((cat, i) => {
              return <option key={i} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            })}
          </select>
        </div>
      </aside>

      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="search-product-list">
          { productLoading ? <SkeletonLoader /> : searchedData?.products.map((product, i) => {
            return <ProductCard
            key={i}
            productId={product._id}
            price={product.price}
            name={product.name}
            photo={product.photo}
            stock={product.stock}
            handler={addToCartHandler}
          />
          }) }
        </div>

        {searchedData && searchedData.totalPages > 1 && (
          <article>
            <button disabled={!isPrevPage} onClick={() => setPage(prev => prev - 1)}>Prev</button>
            <span> {page} of {searchedData.totalPages} </span>
            <button disabled={!isNextPage} onClick={() => setPage(prev => prev + 1)}>Next</button>
          </article>
        )}
      </main>
    </div>
  )
}

export default Search
