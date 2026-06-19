import { useState } from "react";

export default function Customers() {
  const [customers, setCustomers] = useState([
    { name: "John Doe", balance: 300 },
    { name: "Ama K.", balance: 120 }
  ]);

  const [name, setName] = useState("");

  const addCustomer = () => {
    if (!name) return;
    setCustomers([...customers, { name, balance: 0 }]);
    setName("");
  };

  return (
    <div>
      <h2>Customers</h2>

      <div className="formRow">
        <input
          placeholder="Customer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addCustomer}>Add</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td>${c.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}