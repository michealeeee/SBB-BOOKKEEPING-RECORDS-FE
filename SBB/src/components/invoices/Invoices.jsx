import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { badgeClass, formatDate, formatMoney } from "../../utils/format";

const emptyForm = {
  customer: "",
  amount: "",
  due: "",
  status: "Draft",
};

export default function Invoices() {
  const { invoices, customers, addInvoice, updateInvoiceStatus } = useApp();
  const [form, setForm] = useState({
    ...emptyForm,
    customer: customers[0]?.name || "",
  });
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const visible = useMemo(() => {
    return invoices.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const haystack = `${item.id} ${item.customer}`.toLowerCase();
      return matchesStatus && haystack.includes(query.trim().toLowerCase());
    });
  }, [invoices, query, statusFilter]);

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.customer || !form.amount || !form.due) {
      setError("Customer, amount, and due date are required.");
      return;
    }
    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    addInvoice({
      customer: form.customer,
      amount: Number(form.amount),
      due: form.due,
      status: form.status,
    });
    setForm({ ...emptyForm, customer: customers[0]?.name || "" });
    setSuccess("Invoice created in this demo session. No email was sent.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Create and track invoices. Sending and collection are not connected yet.</p>
      </header>

      <section className="panel">
        <h2>New invoice</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="inv-customer">Customer</label>
            <select
              id="inv-customer"
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
            >
              {customers.map((customer) => (
                <option key={customer.id} value={customer.name}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="inv-amount">Amount</label>
            <input
              id="inv-amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="inv-due">Due date</label>
            <input
              id="inv-due"
              type="date"
              value={form.due}
              onChange={(e) => setForm({ ...form, due: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="inv-status">Status</label>
            <select
              id="inv-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Draft</option>
              <option>Sent</option>
              <option>Paid</option>
              <option>Overdue</option>
            </select>
          </div>
          <button className="btn" type="submit">
            Create invoice
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="field">
            <label htmlFor="inv-search">Search</label>
            <input
              id="inv-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Invoice or customer"
            />
          </div>
          <div className="field">
            <label htmlFor="inv-filter">Status</label>
            <select
              id="inv-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option>Draft</option>
              <option>Sent</option>
              <option>Paid</option>
              <option>Overdue</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          {visible.length === 0 ? (
            <p className="empty-state">No invoices match this search.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Issued</th>
                  <th>Due</th>
                  <th className="num">Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.customer}</td>
                    <td>{formatDate(item.issued)}</td>
                    <td>{formatDate(item.due)}</td>
                    <td className="num">{formatMoney(item.amount)}</td>
                    <td>
                      <span className={badgeClass(item.status)}>{item.status}</span>
                    </td>
                    <td>
                      {item.status !== "Paid" ? (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => updateInvoiceStatus(item.id, "Paid")}
                        >
                          Mark paid
                        </button>
                      ) : (
                        <span className="muted">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
