import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatMoney } from "../../utils/format";

export default function Taxes() {
  const { totals } = useApp();
  const [rate, setRate] = useState(15);
  const income = totals.income;
  const taxAmount = income * (Number(rate) || 0) / 100;

  return (
    <div className="app-page">
      <header className="page-header">
        <div>
          <h1>Taxes</h1>
          <p>
            Estimate only, using demo income. This is not a filing, remittance, or
            official tax calculation.
          </p>
        </div>
      </header>

      <section className="panel">
        <div className="stat-pills">
          <div className="stat-pill">Taxable income {formatMoney(income)}</div>
          <div className="stat-pill">Rate {Number(rate) || 0}%</div>
          <div className="stat-pill">Estimated tax {formatMoney(taxAmount)}</div>
        </div>

        <div className="field" style={{ maxWidth: 240 }}>
          <label htmlFor="tax-rate">Estimated rate (%)</label>
          <input
            id="tax-rate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
      </section>
    </div>
  );
}
