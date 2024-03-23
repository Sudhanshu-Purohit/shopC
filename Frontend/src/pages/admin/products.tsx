import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import toast from "react-hot-toast";
import { CustomError } from "../../types/api-types";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];


const Products = () => {
  const [rows, setRows] = useState<DataType[]>([]);
  const selector = useSelector((state: { userReducer: UserReducerInitialState }) => (state.userReducer));
  const { data, isError, isLoading, error } = useAllProductsQuery(selector.user?._id!);

  if (isError) {
    toast.error((error as CustomError).data.message);
  }

  useEffect(() => {
    if (data) {
      setRows(data.products.map((product, i) => ({
        photo: <img src={`${import.meta.env.VITE_BACKEND_URL}/${product.photo}`} />,
        name: product.name,
        price: product.price,
        stock: product.stock,
        action: <Link to={`/admin/product/${product._id}`}>Manage</Link>
      })))
    }
  }, [data])


  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
