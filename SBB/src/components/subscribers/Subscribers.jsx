import { useState } from "react";

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([
    {
      name: "Ama K.",
      plan: "Professional",
      status: "Active",
      renew: "2026-02-10"
    },
    {
      name: "John D.",
      plan: "Starter",
      status: "Active",
      renew: "2026-01-25"
    }
  ]);

  const [form, setForm] = useState({
    name: "",
    plan: "Starter",
    status: "Active",
    renew: ""
  });

  const addSubscriber = () => {
    if (!form.name || !form.renew) return;

    setSubscribers([...subscribers, form]);

    setForm({
      name: "",
      plan: "Starter",
      status: "Active",
      renew: ""
    });
  };

  return (
    <div>
      <h2>Subscribers</h2>

      {/* FORM */}
      <div className="formRow">
        <input
          placeholder="Subscriber name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <select
          value={form.plan}
          onChange={(e) =>
            setForm({ ...form, plan: e.target.value })
          }
        >
          <option>Starter</option>
          <option>Professional</option>
          <option>Enterprise</option>
        </select>

        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option>Active</option>
          <option>Suspended</option>
          <option>Cancelled</option>
        </select>

        <input
          type="date"
          value={form.renew}
          onChange={(e) =>
            setForm({ ...form, renew: e.target.value })
          }
        />

        <button onClick={addSubscriber}>Add</button>
      </div>

      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Plan</th>
            <th>Status</th>
            <th>Renewal Date</th>
          </tr>
        </thead>

        <tbody>
          {subscribers.map((s, i) => (
            <tr key={i}>
              <td>{s.name}</td>
              <td>{s.plan}</td>
              <td>{s.status}</td>
              <td>{s.renew}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}