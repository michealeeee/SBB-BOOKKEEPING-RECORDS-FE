import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { formatMoney } from "../../utils/format";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const COLORS = ["#1b6b4a", "#16324f", "#b45309", "#b42318", "#2c5278", "#5b6b7c"];

export default function CategoryBarChart({ title, rows, emptyLabel = "No activity yet" }) {
  const labels = rows.map(([name]) => name);
  const values = rows.map(([, amount]) => amount);
  const empty = !labels.length;

  const data = {
    labels: empty ? [emptyLabel] : labels,
    datasets: [
      {
        data: empty ? [0] : values,
        backgroundColor: empty
          ? ["#d7dee6"]
          : labels.map((_, index) => COLORS[index % COLORS.length]),
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label(context) {
            return formatMoney(context.raw);
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback(value) {
            return formatMoney(value);
          },
        },
        grid: { color: "#eef1f4" },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#5b6b7c", font: { size: 12 } },
      },
    },
  };

  return (
    <div className="chart-box">
      <h3>{title}</h3>
      <div className="chart-frame chart-frame-tall">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
