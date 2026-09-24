import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { customerLabel } from "../../utils/entities";
import { badgeClass, formatDate, formatMoney } from "../../utils/format";

const emptyForm = {
  customer_id: "",
  amount: "",
  due_date: "",
  status: "unpaid",
};

export default function Invoices() {
  const { invoices, customers, addInvoice, updateInvoiceStatus, findCustomer } = useApp();
  const [form, setForm] = useState({
    ...emptyForm,
    customer_id: customers[0]?.customerid || "",
  });
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const visible = useMemo(() => {
    return invoices.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const customer = findCustomer(item.customer_id);
      const haystack = `${item.invoice_no} ${customerLabel(customer)}`.toLowerCase();
      return matchesStatus && haystack.includes(query.trim().toLowerCase());
    });
  }, [invoices, query, statusFilter, findCustomer]);

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.amount) {
      setError("Amount is required.");
      return;
    }
    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    const result = addInvoice({
      customer_id: form.customer_id || null,
      amount: Number(form.amount),
      due_date: form.due_date,
      status: form.status,
    });
    if (result?.error) {
      setError(result.error);
      return;
    }
    setForm({ ...emptyForm, customer_id: customers[0]?.customerid || "" });
    setSuccess("Invoice created for this business. No email was sent.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Invoices belong to the business and can optionally link to a customer. Status is paid, unpaid, or partial.</p>
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
              value={form.customer_id}
              onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
            >
              <option value="">No customer</option>
              {customers.map((customer) => (
                <option key={customer.customerid} value={customer.customerid}>
                  {customerLabel(customer)}
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
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="inv-status">Status</label>
            <select
              id="inv-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
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
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
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
                  <th>Invoice no</th>
                  <th>Customer</th>
                  <th>created_at</th>
                  <th>updated_at</th>
                  <th>Due date</th>
                  <th className="num">Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.invoice_no}>
                    <td>{item.invoice_no}</td>
                    <td>{customerLabel(findCustomer(item.customer_id))}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>{formatDate(item.updated_at)}</td>
                    <td>{item.due_date ? formatDate(item.due_date) : "—"}</td>
                    <td className="num">{formatMoney(item.amount)}</td>
                    <td>
                      <span className={badgeClass(item.status)}>{item.status}</span>
                    </td>
                    <td>
                      {item.status !== "paid" ? (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => updateInvoiceStatus(item.invoice_no, "paid")}
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
