import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="loader">
      <ClipLoader color="#000000" size={50} />
    </div>
  )
}

export const SkeletonLoader = () => {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
    </div>
  )
}

export default Loader
