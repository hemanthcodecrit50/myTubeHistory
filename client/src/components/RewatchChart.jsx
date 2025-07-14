import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RewatchChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => entry.channelTitle),
    datasets: [
      {
        label: "Videos Watched",
        data: data.map((entry) => entry.count),
        backgroundColor: "rgba(239, 68, 68, 0.7)", // red-500
        borderRadius: 5,
      },
    ],
  };

  const options = {
    indexAxis: "y", // horizontal bars
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "🔁 Rewatch Frequency (Top Channels)" },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default RewatchChart;
