import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

const AdminChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'Product Progress',
        data: [10, 20, 30, 40],
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          drawBorder: false,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default AdminChart;

