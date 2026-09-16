import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { isSuperAdmin, normalizeEmail } from "./data/admin";
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
import Suspended from "./components/Suspended";
import AdminOverview from "./components/admin/AdminOverview";
import AdminAccounts from "./components/admin/AdminAccounts";
import AdminPlans from "./components/admin/AdminPlans";
import LandingPage from "./components/LandingPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import "./App.css";

function postAuthPath(user) {
  if (isSuperAdmin(user)) return "/admin";
  if (hasSubscription(user)) return "/app";
  return "/app/subscription";
}

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
    return <Navigate to={postAuthPath(user)} replace />;
  }
  return children;
}

function AdminOnly() {
  const { user } = useApp();
  if (!isSuperAdmin(user)) {
    return <Navigate to={hasSubscription(user) ? "/app" : "/app/subscription"} replace />;
  }
  return <Outlet />;
}

function CustomerOnly({ children }) {
  const { user } = useApp();
  if (isSuperAdmin(user)) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

function accountStatus(user, accounts) {
  const account = accounts.find(
    (item) => normalizeEmail(item.email) === normalizeEmail(user?.email)
  );
  return account?.status || "Active";
}

function NotSuspendedRoute() {
  const { user, accounts } = useApp();
  const status = accountStatus(user, accounts);
  if (status === "Suspended" || status === "Cancelled") {
    return <Navigate to="/app/suspended" replace />;
  }
  return <Outlet />;
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
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminOnly />
              </ProtectedRoute>
            }
          >
            <Route element={<AppLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="accounts" element={<AdminAccounts />} />
              <Route path="plans" element={<AdminPlans />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <CustomerOnly>
                  <AppLayout />
                </CustomerOnly>
              </ProtectedRoute>
            }
          >
            <Route path="suspended" element={<Suspended />} />
            <Route element={<NotSuspendedRoute />}>
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
              <Route path="subscriptions" element={<Subscribers />} />
              <Route path="subscribers" element={<Navigate to="/app/subscriptions" replace />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
