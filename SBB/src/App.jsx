import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./components/dashboard/Dashboard";
import Income from "./components/income/Income";
import Invoices from "./components/invoices/Invoices";
import Reports from "./components/reports/Reports";
import Expenses from "./components/expenses/Expenses";
import Vendors from "./components/vendors/Vendors";
import Customers from "./components/customers/Customers";
import Taxes from "./components/taxes/Taxes";
import Subscription from "./components/subscription/Subscription";
import Team from "./components/team/Team";
import Business from "./components/business/Business";
import LandingPage from "./components/LandingPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import "./App.css";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

function PublicOnly({ children }) {
  const { isAuthenticated } = useApp();
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/signin"
            element={
              <PublicOnly>
                <SignIn />
              </PublicOnly>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnly>
                <SignUp />
              </PublicOnly>
            }
          />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="income" element={<Income />} />
            <Route path="transactions" element={<Navigate to="/app/income" replace />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="reports" element={<Reports />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="customers" element={<Customers />} />
            <Route path="taxes" element={<Taxes />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="subscriptions" element={<Navigate to="/app/subscription" replace />} />
            <Route path="subscribers" element={<Navigate to="/app/subscription" replace />} />
            <Route path="team" element={<Team />} />
            <Route path="business" element={<Business />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
