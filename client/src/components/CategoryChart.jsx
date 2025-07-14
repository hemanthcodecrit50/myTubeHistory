

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, 
    CategoryScale, LinearScale, 
    BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(
    CategoryScale, LinearScale, BarElement, 
    Title, Tooltip, Legend
);

const CategoryChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => entry.categoryName),
    datasets: [
      {
        label: "Video Count",
        data: data.map((entry) => entry.count),
        backgroundColor: "rgba(59, 130, 246, 0.7)", // Tailwind blue-500
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
        text: "YouTube Video Categories",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default CategoryChart;
