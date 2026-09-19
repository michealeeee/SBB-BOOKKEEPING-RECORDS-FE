import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { userLabel } from "../../utils/entities";
import { badgeClass } from "../../utils/format";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  role: "staff",
};

export default function Team() {
  const { members, membership, addMember, updateMember } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const canManage = membership?.role === "owner" || membership?.role === "admin";

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!canManage) {
      setError("Only an owner or admin can add users.");
      return;
    }
    if (!form.first_name.trim() || !form.email.trim()) {
      setError("First name and email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    const result = addMember({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      role: form.role,
    });
    if (result?.error) {
      setError(result.error);
      return;
    }
    setForm(emptyForm);
    setSuccess("Member added to this business. They would sign in with their own user account.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          BusinessMember connects a user to this business with a role of owner, admin, or staff.
        </p>
      </header>

      <section className="panel">
        <h2>Add member</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="mem-first">First name</label>
            <input
              id="mem-first"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="mem-last">Last name</label>
            <input
              id="mem-last"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="mem-email">Email</label>
            <input
              id="mem-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="mem-role">Role</label>
            <select
              id="mem-role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <button className="btn" type="submit">
            Add member
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>Members</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Access</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map((item) => (
                <tr key={item.userid}>
                  <td>{userLabel(item)}</td>
                  <td>{item.email}</td>
                  <td>
                    <span className={badgeClass(item.role)}>{item.role}</span>
                  </td>
                  <td>
                    <span className={badgeClass(item.active ? "active" : "cancelled")}>
                      {item.active ? "active" : "inactive"}
                    </span>
                  </td>
                  <td>
                    {canManage ? (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => updateMember(item.userid, { active: !item.active })}
                      >
                        {item.active ? "Deactivate" : "Activate"}
                      </button>
                    ) : (
                      <span className="muted">View only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
