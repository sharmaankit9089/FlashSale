import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function SalesChart({ sold, expired }) {
  const data = {
    labels: ["Sold", "Expired"],
    datasets: [
      {
        label: "Orders",
        data: [sold, expired],
        backgroundColor: ["#16a34a", "#dc2626"]
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3">
        Sold vs Expired (Since Server Start)
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default SalesChart;
