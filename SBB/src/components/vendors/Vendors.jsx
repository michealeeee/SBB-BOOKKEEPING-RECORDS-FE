import { useState } from "react";

export default function Vendors() {
  const [vendors, setVendors] = useState([
    { name: "Office Supplies Ltd", contact: "0240000000", email: "info@office.com" }
  ]);

  const [form, setForm] = useState({ name: "", contact: "", email: "" });

  const addVendor = () => {
    if (!form.name) return;
    setVendors([...vendors, form]);
    setForm({ name: "", contact: "", email: "" });
  };

  return (
    <div>
      <h2>Vendors</h2>

      <div className="formRow">
        <input placeholder="Vendor name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input placeholder="Contact"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
        />

        <input placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <button onClick={addVendor}>Add</button>
      </div>

      <ul className="list">
        {vendors.map((v, i) => (
          <li key={i}>
            <strong>{v.name}</strong> — {v.contact} — {v.email}
          </li>
        ))}
      </ul>
    </div>
  );
}