import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import "./PartySpeechChart.css";
import type { Party } from "../../types/Party";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type PartySpeechChartProps = {
  parties: Party[];
};

export default function PartySpeechChart({
  parties
}: PartySpeechChartProps): React.ReactElement {
  const [mode, setMode] = useState<"total" | "average">("total");

  const labels = parties.map((p) => p.party);
  const colors = parties.map((p) => p.party_color);

  const values =
    mode === "total"
      ? parties.map((p) => p.total_speeches)
      : parties.map((p) =>
          p.member_count > 0
            ? Number((p.total_speeches / p.member_count).toFixed(2))
            : 0
        );

  const data = {
    labels,
    datasets: [
      {
        label:
          mode === "total"
            ? "Puheet yhteensä"
            : "Puheet per kansanedustaja",
        data: values,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  };

  return (
    <div className="party-speech-chart-container">
      <div className="party-speech-chart-header">
        <h2 className="party-speech-chart-title">Puheet puolueittain</h2>

        <button
          className="party-speech-chart-toggle"
          onClick={() =>
            setMode((prev) => (prev === "total" ? "average" : "total"))
          }
        >
          {mode === "total"
            ? "Näytä puheenvuorot / edustaja"
            : "Näytä puheenvuorot yhteensä"}
        </button>
      </div>

      <Bar data={data} options={options} />
    </div>
  );
}
