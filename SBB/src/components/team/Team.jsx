import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { userLabel } from "../../utils/entities";
import { badgeClass, formatDate } from "../../utils/format";
import FieldLabel from "../FieldLabel";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  role: "staff",
  active: true,
};

export default function Team() {
  const { user, members, membership, addMember, updateMember } = useApp();
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
      active: form.active,
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
        <h2>Signed-in user</h2>
        <p className="muted">The frontend uses userid, first_name, last_name and email. Password is never stored here.</p>
        <table className="data-table">
          <tbody>
            <tr><th>userid</th><td>{user?.userid || "—"}</td></tr>
            <tr><th>first_name</th><td>{user?.first_name || "—"}</td></tr>
            <tr><th>last_name</th><td>{user?.last_name || "—"}</td></tr>
            <tr><th>email</th><td>{user?.email || "—"}</td></tr>
            <tr><th>created_at</th><td>{formatDate(user?.created_at)}</td></tr>
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h2>Add member</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <FieldLabel htmlFor="mem-first" required>
              First name
            </FieldLabel>
            <input
              id="mem-first"
              value={form.first_name}
              required
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
            <FieldLabel htmlFor="mem-email" required>
              Email
            </FieldLabel>
            <input
              id="mem-email"
              type="email"
              value={form.email}
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <FieldLabel htmlFor="mem-role" required>
              Role
            </FieldLabel>
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
          <div className="field">
            <label htmlFor="mem-active">Active</label>
            <select
              id="mem-active"
              value={form.active ? "true" : "false"}
              onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
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
                <th>userid</th>
                <th>businessid</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Access</th>
                <th>created_at</th>
                <th>updated_at</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map((item) => (
                <tr key={item.userid}>
                  <td>{item.userid}</td>
                  <td>{item.businessid || "—"}</td>
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
                  <td>{formatDate(item.created_at)}</td>
                  <td>{formatDate(item.updated_at)}</td>
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
