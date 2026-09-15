import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { formatMoney } from "../../utils/format";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({
  title,
  labels,
  values,
  colors,
  centerLabel,
  centerValue,
}) {
  const safeValues = values.length ? values : [0];
  const data = {
    labels: labels.length ? labels : ["No data"],
    datasets: [
      {
        data: safeValues,
        backgroundColor: colors,
        borderColor: "#ffffff",
        borderWidth: 3,
        cutout: "72%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 10, font: { size: 12 }, padding: 14 },
      },
      tooltip: {
        callbacks: {
          label(context) {
            return `${context.label}: ${formatMoney(context.raw)}`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-box">
      <h3>{title}</h3>
      <div className="donut-wrap">
        <div className="chart-frame">
          <Doughnut data={data} options={options} />
        </div>
        {centerLabel ? (
          <div className="donut-center">
            <strong>{centerValue}</strong>
            <span>{centerLabel}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
