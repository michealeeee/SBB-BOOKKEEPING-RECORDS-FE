import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import Transactions from "./components/transactions/Transactions";
import Invoices from "./components/invoices/Invoices";
import Reports from "./components/reports/Reports";
import Expenses from "./components/expenses/Expenses";
import Vendors from "./components/vendors/Vendors";
import Customers from "./components/customers/Customers";
import Taxes from "./components/taxes/Taxes";
import Subscribers from "./components/subscribers/Subscribers";
import LandingPage from "./components/LandingPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "transactions":
        return <Transactions />;
      case "invoices":
        return <Invoices />;
      case "reports":
        return <Reports />;
      case "expenses":
        return <Expenses />;
      case "vendors":
        return <Vendors />;
      case "customers":
        return <Customers />;
      case "taxes":
        return <Taxes />;
      case "subscribers":
        return <Subscribers />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        <Route
          path="/*"
          element={
            <div className="dashboard-shell">
              {isAuthenticated ? (
                <LandingPage />
              ) : (
                <>
               

                  <nav className="dashboard-navbar">
                    <div className="dashboard-logo">Bookkeeply</div>

                    <div className="dashboard-desktop-menu">
                      <button onClick={() => setPage("dashboard")}>
                        Dashboard
                      </button>

                      <button onClick={() => setPage("transactions")}>
                        Transactions
                      </button>

                      <button onClick={() => setPage("invoices")}>
                        Invoices
                      </button>

                      <button onClick={() => setPage("reports")}>
                        Reports
                      </button>

                      <button onClick={() => setPage("expenses")}>
                        Expenses
                      </button>

                      <button onClick={() => setPage("vendors")}>
                        Vendors
                      </button>

                      <button onClick={() => setPage("customers")}>
                        Customers
                      </button>

                      <button onClick={() => setPage("taxes")}>Taxes</button>
                    </div>

                    <button
                      className="dashboard-toggle"
                      onClick={() => setMobileOpen(true)}
                    >
                      ☰
                    </button>
                  </nav>

                  <main className="dashboard-main-content">{renderPage()}</main>
                </>
              )}
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
