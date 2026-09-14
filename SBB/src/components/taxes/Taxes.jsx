import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatMoney } from "../../utils/format";

export default function Taxes() {
  const { totals } = useApp();
  const [rate, setRate] = useState(15);
  const income = totals.income;
  const taxAmount = (income * (Number(rate) || 0)) / 100;
  const afterTax = income - taxAmount;

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          A simple estimate from book income. This is not a filing or official tax
          calculation.
        </p>
      </header>

      <section className="panel">
        <div className="field" style={{ maxWidth: 240, marginBottom: 16 }}>
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

        <table className="data-table pl-table">
          <tbody>
            <tr>
              <td>Taxable income</td>
              <td className="num">{formatMoney(income)}</td>
            </tr>
            <tr>
              <td>Rate</td>
              <td className="num">{Number(rate) || 0}%</td>
            </tr>
            <tr>
              <td>Estimated tax</td>
              <td className="num amount-neg">{formatMoney(taxAmount)}</td>
            </tr>
            <tr className="pl-total">
              <td>Income after estimate</td>
              <td className="num">{formatMoney(afterTax)}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
