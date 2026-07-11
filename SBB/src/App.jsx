import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";


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
import "./styles/landing.css";
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
            <div className="app-container">
              {!isAuthenticated ? (
                <LandingPage />
              ) : (
                <>
                  <header className="mobile-header">
                    <button
                      className="menu-btn"
                      onClick={() => setMobileOpen(!mobileOpen)}
                    >
                      ☰
                    </button>

                    <h2>Bookkeeping</h2>
                  </header>

                  <Sidebar
                    setPage={setPage}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                  />

                  <main className="main-content">
                    {renderPage()}
                  </main>
                </>
              )}
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}