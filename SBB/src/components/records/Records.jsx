import { MODELS, documentRequiredFields, formRequiredFields } from "../../data/models";
import { useApp } from "../../context/AppContext";

const COUNT_KEYS = {
  user: (books) => books.users?.length || 0,
  business: () => 1,
  businessMember: (books) => books.members.length,
  customer: (books) => books.customers.length,
  invoice: (books) => books.invoices.length,
  income: (books) => books.income.length,
  expense: (books) => books.expenses.length,
  vendor: (books) => books.vendors.length,
  plan: (books) => books.plans.length,
  subscription: () => 1,
  subscriptionPayment: (books) => books.payments.length,
};

function fieldList(fields) {
  if (!fields.length) return "—";
  return fields.map((field) => field.name).join(", ");
}

export default function Records() {
  const books = useApp();

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          Bookkeeping records follow models 1–12. Business-owned rows use{" "}
          <code>businessid</code>. Required fields marked in the guide are listed
          next to the fields this UI asks for when creating a record.
        </p>
      </header>

      <section className="panel">
        <h2>How records connect</h2>
        <p className="muted">
          User → BusinessMember → Business → Customer, Invoice, Income, Expense,
          Vendor, and Subscription. Invoices may link to a customer. Income may
          link to an invoice. Subscription uses a Plan. SubscriptionPayment
          stores plan payments.
        </p>
      </section>

      {MODELS.map((model) => {
        const required = documentRequiredFields(model.key);
        const formRequired = formRequiredFields(model.key);
        const count = COUNT_KEYS[model.key]?.(books);

        return (
          <section className="panel" key={model.key}>
            <h2>
              {model.number}. {model.name}
              {typeof count === "number" ? (
                <span className="muted model-count"> · {count} record{count === 1 ? "" : "s"}</span>
              ) : null}
            </h2>
            <p>{model.summary}</p>
            {model.identityRule ? <p className="muted">{model.identityRule}</p> : null}
            {model.fields.length > 0 ? (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Model required</th>
                      <th>Form required</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.fields.map((field) => (
                      <tr key={field.name}>
                        <td>
                          <code>{field.name}</code>
                        </td>
                        <td>{field.required ? "Yes" : "No"}</td>
                        <td>{field.formRequired && field.frontend !== false ? "Yes" : field.frontend === false ? "Backend only" : "No"}</td>
                        <td>
                          {[
                            field.generated ? "Set by the app" : null,
                            field.nullable ? "May be empty" : null,
                            field.unique ? "Must be unique" : null,
                            field.choices ? field.choices.join(", ") : null,
                            field.defaultValue != null ? `Default: ${String(field.defaultValue)}` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {model.fields.length > 0 ? (
              <p className="muted form-hint">
                Required on the document: {fieldList(required) || "none marked required"}.
                Required on create forms: {fieldList(formRequired) || "none"}.
              </p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
