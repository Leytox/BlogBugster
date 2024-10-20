import { useGetMetricsQuery } from "../../features/metrics/metricsApiSlice";
import { Bar, Line } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import Loader from "../../components/Loader.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const AdminOverview = () => {
  const { data, isLoading, error } = useGetMetricsQuery();

  if (isLoading)
    return (
      <div className={"h-screen flex justify-center items-center"}>
        <Loader />
      </div>
    );

  if (error) return <div className={"text-red-500"}>Error loading metrics</div>;

  const { usersOverTime, postsCategories, postsOverTime, bansOverTime } = data;

  const newPostsData = {
    labels: postsOverTime.map((item) => item._id),
    datasets: [
      {
        label: "New Posts",
        data: postsOverTime.map((item) => item.count),
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const newUsersData = {
    labels: usersOverTime.map((item) => item._id),
    datasets: [
      {
        label: "New Users",
        data: usersOverTime.map((item) => item.count),
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const barData = {
    labels: postsCategories.map((item) => item._id),
    datasets: [
      {
        label: "Categories",
        data: postsCategories.map((item) => item.count),
        backgroundColor: postsCategories.map((item) => {
          switch (item._id) {
            case "software":
              return "rgba(255, 99, 132, 0.2)";
            case "hardware":
              return "rgba(54, 100, 150, 0.2)";
            case "miscellaneous":
              return "rgba(255, 206, 86, 0.2)";
            default:
              return "rgba(75, 192, 192, 0.2)";
          }
        }),
        borderColor: postsCategories.map((item) => {
          switch (item._id) {
            case "software":
              return "rgba(255, 99, 132, 1)";
            case "hardware":
              return "rgba(54, 100, 150, 1)";
            case "miscellaneous":
              return "rgba(255, 206, 86, 1)";
            default:
              return "rgba(75, 192, 192, 1)";
          }
        }),
        borderWidth: 1,
      },
    ],
  };

  const bansData = {
    labels: bansOverTime.map((item) => item._id),
    datasets: [
      {
        label: "Bans",
        data: bansOverTime.map((item) => item.count),
        fill: false,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  return (
    <div className={"flex flex-wrap flex-col gap-16"}>
      <div className={"flex flex-col"}>
        <h1 className={"text-2xl text-center mb-6"}>Users</h1>
        <Line data={newUsersData} className={"flex-1 max-w-fit max-h-72"} />
      </div>
      <div className={"flex flex-col"}>
        <h1 className={"text-2xl text-center mb-6"}>Posts</h1>
        <div className={"w-full flex justify-evenly"}>
          <Bar data={barData} className={"max-w-96 max-h-72"} />
          <Line data={newPostsData} className={"max-w-96 max-h-72"} />
        </div>
      </div>
      <div className={"flex flex-col"}>
        <h1 className={"text-2xl text-center mb-6"}>Bans</h1>
        <Line data={bansData} className={"flex-1 max-w-fit max-h-72"} />
      </div>
    </div>
  );
};

export default AdminOverview;
