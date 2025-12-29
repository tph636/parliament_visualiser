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

import "./PartyValihuutoChart.css";
import type { Party } from "../../types/Party";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type PartyValihuutoChartProps = {
  parties: Party[];
};

export default function PartyValihuutoChart({
  parties
}: PartyValihuutoChartProps): React.ReactElement {
  const [mode, setMode] = useState<"total" | "average">("total");

  const labels = parties.map((p) => p.party);
  const colors = parties.map((p) => p.party_color);

  const values =
    mode === "total"
      ? parties.map((p) => p.total_valihuudot)
      : parties.map((p) =>
          p.member_count > 0
            ? Number((p.total_valihuudot / p.member_count).toFixed(2))
            : 0
        );

  const data = {
    labels,
    datasets: [
      {
        label:
          mode === "total"
            ? "Välihuudot yhteensä"
            : "Välihuudot per kansanedustaja",
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
    <div className="party-chart-container">
      <div className="party-chart-header">
        <h2 className="party-chart-title">Välihuudot puolueittain</h2>

        <button
          className="party-chart-toggle"
          onClick={() =>
            setMode((prev) => (prev === "total" ? "average" : "total"))
          }
        >
          {mode === "total"
            ? "Näytä välihuudot / edustaja"
            : "Näytä välihuudot yhteensä"}
        </button>
      </div>

      <Bar data={data} options={options} />
    </div>
  );
}
