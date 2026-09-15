import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatMoney } from "../../utils/format";

export default function Taxes() {
  const { totals } = useApp();
  const [rate, setRate] = useState(15);
  const income = totals.income;
  const pct = Math.min(100, Math.max(0, Number(rate) || 0));
  const taxAmount = (income * pct) / 100;
  const afterTax = income - taxAmount;
  const circumference = 2 * Math.PI * 48;
  const dash = (pct / 100) * circumference;

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          A simple estimate from book income. This is not a filing or official tax
          calculation.
        </p>
      </header>

      <section className="panel tax-panel">
        <div className="tax-visual">
          <div className="tax-ring">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle className="tax-track" cx="60" cy="60" r="48" />
              <circle
                className="tax-progress"
                cx="60"
                cy="60"
                r="48"
                strokeDasharray={`${dash} ${circumference}`}
              />
            </svg>
            <div className="tax-ring-label">
              <strong>{pct}%</strong>
              <span>rate</span>
            </div>
          </div>
          <div className="tax-copy">
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
            <p className="muted">
              Applied to {formatMoney(income)} of recorded income.
            </p>
          </div>
        </div>

        <div className="stats-grid tax-stats">
          <article className="stat-card net">
            <span>Taxable income</span>
            <strong className="num">{formatMoney(income)}</strong>
          </article>
          <article className="stat-card expense">
            <span>Estimated tax</span>
            <strong className="num">{formatMoney(taxAmount)}</strong>
          </article>
          <article className="stat-card income">
            <span>After estimate</span>
            <strong className="num">{formatMoney(afterTax)}</strong>
          </article>
        </div>

        <div className="mix-bar" aria-hidden="true">
          <span className="mix-fill expense" style={{ width: `${pct}%` }} />
          <span className="mix-fill income" style={{ width: `${100 - pct}%` }} />
        </div>
        <div className="mix-legend">
          <span>
            <i className="dot expense" /> Estimated tax
          </span>
          <span>
            <i className="dot income" /> Income kept
          </span>
        </div>
      </section>
    </div>
  );
}
