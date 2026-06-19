import { useState } from "react";

export default function Expenses() {
  const [items, setItems] = useState([
    { name: "Office Rent", amount: 1200, category: "Fixed" },
    { name: "Internet", amount: 80, category: "Utilities" }
  ]);

  const [form, setForm] = useState({ name: "", amount: "", category: "" });

  const addExpense = () => {
    if (!form.name || !form.amount) return;
    setItems([...items, form]);
    setForm({ name: "", amount: "", category: "" });
  };

  return (
    <div>
      <h2>Expenses</h2>

      <div className="formRow">
        <input placeholder="Expense name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <button onClick={addExpense}>Add</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Category</th>
          </tr>
        </thead>

        <tbody>
          {items.map((i, index) => (
            <tr key={index}>
              <td>{i.name}</td>
              <td>${i.amount}</td>
              <td>{i.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}