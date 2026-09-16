import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { hasSubscription } from "./data/plans";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./components/dashboard/Dashboard";
import Transactions from "./components/transactions/Transactions";
import Invoices from "./components/invoices/Invoices";
import Reports from "./components/reports/Reports";
import Expenses from "./components/expenses/Expenses";
import Vendors from "./components/vendors/Vendors";
import Customers from "./components/customers/Customers";
import Taxes from "./components/taxes/Taxes";
import Subscribers from "./components/subscribers/Subscribers";
import Subscription from "./components/subscription/Subscription";
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
  const { isAuthenticated, user } = useApp();
  if (isAuthenticated) {
    return <Navigate to={hasSubscription(user) ? "/app" : "/app/subscription"} replace />;
  }
  return children;
}

function SubscribedRoute() {
  const { user } = useApp();
  if (!hasSubscription(user)) {
    return <Navigate to="/app/subscription" replace />;
  }
  return <Outlet />;
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
            <Route path="subscription" element={<Subscription />} />
            <Route element={<SubscribedRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="reports" element={<Reports />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="vendors" element={<Vendors />} />
              <Route path="customers" element={<Customers />} />
              <Route path="taxes" element={<Taxes />} />
              <Route path="subscribers" element={<Subscribers />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
