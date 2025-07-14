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

const DurationChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => entry.range),
    datasets: [
      {
        label: "Video Count",
        data: data.map((entry) => entry.count),
        backgroundColor: "rgba(34, 197, 94, 0.7)", // green-500
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "📐 Video Duration Distribution",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default DurationChart;
