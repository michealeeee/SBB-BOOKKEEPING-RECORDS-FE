import { useState } from "react";
import "./App.css";
import LandingPage from "./components/LandingPage";
import "./styles/landing.css";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/dashboard/Dashboard";
import Transactions from "./components/transactions/Transactions";
import Invoices from "./components/invoices/Invoices";
import Reports from "./components/reports/Reports";
import Expenses from "./components/expenses/Expenses";
import Vendors from "./components/vendors/Vendors";
import Customers from "./components/customers/Customers";
import Taxes from "./components/taxes/Taxes";
import Subscribers from "./components/subscribers/Subscribers";

export default function App() {
  // controls landing vs app
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // controls dashboard pages
  const [page, setPage] = useState("dashboard");

  // ---------- LANDING PAGE ----------
  if (isLoggedIn) {
    return <LandingPage onLogin={() => setIsLoggedIn(true)} />;
  }

  // ---------- DASHBOARD APP ----------
  return (
    <div className="app">
      <Sidebar setPage={setPage} />

      <div className="main">
        {page === "dashboard" && <Dashboard />}
        {page === "transactions" && <Transactions />}
        {page === "invoices" && <Invoices />}
        {page === "reports" && <Reports />}
        {page === "expenses" && <Expenses />}
        {page === "vendors" && <Vendors />}
        {page === "customers" && <Customers />}
        {page === "taxes" && <Taxes />}
        {page === "subscribers" && <Subscribers />}
      </div>
    </div>
  );
}