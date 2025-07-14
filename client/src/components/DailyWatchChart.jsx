import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const DailyWatchChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: "Hours Watched",
        data: data.map((entry) => entry.hours),
        borderColor: "rgba(16, 185, 129, 1)", // green-500
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.3,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "📅 Daily Watch Time (Last 7 Days)" },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Hours" },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default DailyWatchChart;
