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

const WordFrequencyChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => entry.word),
    datasets: [
      {
        label: "Word Count",
        data: data.map((entry) => entry.count),
        backgroundColor: "rgba(147, 51, 234, 0.7)", // purple-500
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
        text: "🧠 Most Common Words in Video Titles",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default WordFrequencyChart;
