import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { getLastMonths } from "../../../utils/features";
import { RootState } from "../../../redux/store";
import { useLineQuery } from "../../../redux/api/dashboardAPI";
import toast from "react-hot-toast";
import { CustomError } from "../../../types/api-types";

const { lastTwelveMonths } = getLastMonths();

const Linecharts = () => {

  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isLoading, isError, data, error } = useLineQuery(user?._id!);

  const charts = data?.charts!;

  if (isError) {
    toast.error((error as CustomError).data.message);
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Line Charts</h1>
        {isLoading ? <Loader /> : (
          <>
            <section>
              <LineChart
                data={charts.lastTwelveMonthUsersCount}
                label="Users"
                borderColor="rgb(53, 162, 255)"
                labels={lastTwelveMonths}
                backgroundColor="rgba(53, 162, 255, 0.5)"
              />
              <h2>Active Users</h2>
            </section>

            <section>
              <LineChart
                data={charts.lastTwelveMonthProductsCount}
                backgroundColor={"hsla(269,80%,40%,0.4)"}
                borderColor={"hsl(269,80%,40%)"}
                labels={lastTwelveMonths}
                label="Products"
              />
              <h2>Total Products (SKU)</h2>
            </section>

            <section>
              <LineChart
                data={charts.lastTwelveMonthRevenue}
                backgroundColor={"hsla(129,80%,40%,0.4)"}
                borderColor={"hsl(129,80%,40%)"}
                label="Revenue"
                labels={lastTwelveMonths}
              />
              <h2>Total Revenue </h2>
            </section>

            <section>
              <LineChart
                data={charts.lastTwelveMonthDiscount}
                backgroundColor={"hsla(29,80%,40%,0.4)"}
                borderColor={"hsl(29,80%,40%)"}
                label="Discount"
                labels={lastTwelveMonths}
              />
              <h2>Discount Allotted </h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Linecharts;
