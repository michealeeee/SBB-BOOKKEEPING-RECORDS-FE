import { useState } from "react";

export default function Taxes() {
  const [income, setIncome] = useState(10000);
  const taxRate = 0.15;

  const taxAmount = income * taxRate;

  return (
    <div>
      <h2>Taxes</h2>

      <div className="cardBox">
        <p>Total Income: ${income}</p>
        <p>Tax Rate: {taxRate * 100}%</p>
        <p><strong>Tax Due: ${taxAmount}</strong></p>
      </div>

      <input
        type="number"
        value={income}
        onChange={(e) => setIncome(Number(e.target.value))}
      />
    </div>
  );
}