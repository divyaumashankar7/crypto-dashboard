import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
);

function CryptoChart({ chartData, coinName }) {
  if (!chartData) return null;

  const data = {
    labels: chartData.map((point) => new Date(point[0]).toLocaleDateString()),
    datasets: [
      {
        label: `${coinName} Price (USD)`,
        data: chartData.map((point) => point[1]),
        borderColor: "cyan",
        backgroundColor: "rgba(0,255,255,0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ width: "80%", margin: "40px auto" }}>
      <Line data={data} />
    </div>
  );
}

export default CryptoChart;
