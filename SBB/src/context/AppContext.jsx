import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "bookkeeply-auth";
const USER_KEY = "bookkeeply-user";

const AppContext = createContext(null);

function createId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const initialTransactions = [
  { id: "t1", date: "2026-08-02", description: "Website redesign project", category: "Services", type: "income", amount: 4200 },
  { id: "t2", date: "2026-08-05", description: "Office rent", category: "Rent", type: "expense", amount: 1200 },
  { id: "t3", date: "2026-08-08", description: "Invoice #1041 — Ama K.", category: "Consulting", type: "income", amount: 1850 },
  { id: "t4", date: "2026-08-12", description: "Software subscriptions", category: "Software", type: "expense", amount: 240 },
  { id: "t5", date: "2026-08-18", description: "Product sales", category: "Sales", type: "income", amount: 3120 },
  { id: "t6", date: "2026-08-22", description: "Internet & utilities", category: "Utilities", type: "expense", amount: 180 },
];

const initialInvoices = [
  { id: "inv-1042", customer: "Ama K.", amount: 1850, status: "Paid", issued: "2026-08-01", due: "2026-08-15" },
  { id: "inv-1043", customer: "John Doe", amount: 2400, status: "Sent", issued: "2026-08-10", due: "2026-08-31" },
  { id: "inv-1044", customer: "Northwind Ltd", amount: 1350, status: "Overdue", issued: "2026-07-12", due: "2026-08-12" },
  { id: "inv-1045", customer: "Ama K.", amount: 1850, status: "Draft", issued: "2026-08-24", due: "2026-09-10" },
];

const initialExpenses = [
  { id: "e1", name: "Office Rent", amount: 1200, category: "Rent", date: "2026-08-05" },
  { id: "e2", name: "Internet", amount: 80, category: "Utilities", date: "2026-08-08" },
  { id: "e3", name: "Accounting software", amount: 49, category: "Software", date: "2026-08-14" },
];

const initialVendors = [
  { id: "v1", name: "Office Supplies Ltd", contact: "024 000 0000", email: "info@office.com" },
  { id: "v2", name: "City Utilities", contact: "030 111 2222", email: "billing@cityutil.com" },
];

const initialCustomers = [
  { id: "c1", name: "John Doe", email: "john@example.com", balance: 2400 },
  { id: "c2", name: "Ama K.", email: "ama@example.com", balance: 1850 },
  { id: "c3", name: "Northwind Ltd", email: "ap@northwind.com", balance: 1350 },
];

const initialSubscribers = [
  { id: "s1", name: "Ama K.", plan: "Premium", status: "Active", renew: "2026-09-10" },
  { id: "s2", name: "John D.", plan: "Basic", status: "Active", renew: "2026-09-25" },
  { id: "s3", name: "Northwind Ltd", plan: "Premium", status: "Suspended", renew: "2026-08-30" },
];

function readAuth() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function readUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { name: "Alex Mensah", email: "alex@bookkeeply.app" };
}

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuth);
  const [user, setUser] = useState(readUser);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [vendors, setVendors] = useState(initialVendors);
  const [customers, setCustomers] = useState(initialCustomers);
  const [subscribers, setSubscribers] = useState(initialSubscribers);

  const signIn = (profile) => {
    setUser(profile);
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
      sessionStorage.setItem(USER_KEY, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
  };

  const addTransaction = (item) => {
    setTransactions((list) => [{ id: createId(), ...item }, ...list]);
  };

  const removeTransaction = (id) => {
    setTransactions((list) => list.filter((item) => item.id !== id));
  };

  const addInvoice = (item) => {
    setInvoices((list) => [
      {
        id: `inv-${1046 + list.length}`,
        status: "Draft",
        issued: new Date().toISOString().slice(0, 10),
        ...item,
      },
      ...list,
    ]);
  };

  const updateInvoiceStatus = (id, status) => {
    setInvoices((list) =>
      list.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const addExpense = (item) => {
    setExpenses((list) => [{ id: createId(), ...item }, ...list]);
  };

  const removeExpense = (id) => {
    setExpenses((list) => list.filter((item) => item.id !== id));
  };

  const addVendor = (item) => {
    setVendors((list) => [{ id: createId(), ...item }, ...list]);
  };

  const removeVendor = (id) => {
    setVendors((list) => list.filter((item) => item.id !== id));
  };

  const addCustomer = (item) => {
    setCustomers((list) => [{ id: createId(), balance: 0, ...item }, ...list]);
  };

  const removeCustomer = (id) => {
    setCustomers((list) => list.filter((item) => item.id !== id));
  };

  const addSubscriber = (item) => {
    setSubscribers((list) => [{ id: createId(), ...item }, ...list]);
  };

  const updateSubscriberStatus = (id, status) => {
    setSubscribers((list) =>
      list.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const totals = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const expenseTotal = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const outstanding = invoices
      .filter((item) => item.status !== "Paid")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return {
      income,
      expenses: expenseTotal,
      net: income - expenseTotal,
      outstanding,
    };
  }, [transactions, invoices]);

  const value = {
    isAuthenticated,
    user,
    signIn,
    signOut,
    transactions,
    invoices,
    expenses,
    vendors,
    customers,
    subscribers,
    totals,
    addTransaction,
    removeTransaction,
    addInvoice,
    updateInvoiceStatus,
    addExpense,
    removeExpense,
    addVendor,
    removeVendor,
    addCustomer,
    removeCustomer,
    addSubscriber,
    updateSubscriberStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
