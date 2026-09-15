import { createContext, useContext, useEffect, useMemo, useState } from "react";

/* Context files export the provider and a hook together. */
/* eslint-disable react-refresh/only-export-components */

const AUTH_KEY = "bookkeeply-auth";
const USER_KEY = "bookkeeply-user";
const BOOKS_KEY = "bookkeeply-books";

const AppContext = createContext(null);

function createId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const seed = {
  transactions: [
    { id: "t1", date: "2026-08-02", description: "Website redesign project", category: "Services", type: "income", amount: 4200 },
    { id: "t2", date: "2026-08-05", description: "Office rent", category: "Rent", type: "expense", amount: 1200 },
    { id: "t3", date: "2026-08-08", description: "Invoice INV-1042 — Ama K.", category: "Consulting", type: "income", amount: 1850 },
    { id: "t4", date: "2026-08-12", description: "Software subscriptions", category: "Software", type: "expense", amount: 240 },
    { id: "t5", date: "2026-08-18", description: "Product sales", category: "Sales", type: "income", amount: 3120 },
    { id: "t6", date: "2026-08-22", description: "Internet & utilities", category: "Utilities", type: "expense", amount: 180 },
    { id: "t7", date: "2026-09-03", description: "Retainer — Northwind Ltd", category: "Consulting", type: "income", amount: 2100 },
    { id: "t8", date: "2026-09-08", description: "Office supplies", category: "Supplies", type: "expense", amount: 96 },
  ],
  invoices: [
    { id: "INV-1042", customer: "Ama K.", amount: 1850, status: "Paid", issued: "2026-08-01", due: "2026-08-15" },
    { id: "INV-1043", customer: "John Doe", amount: 2400, status: "Sent", issued: "2026-08-10", due: "2026-08-31" },
    { id: "INV-1044", customer: "Northwind Ltd", amount: 1350, status: "Overdue", issued: "2026-07-12", due: "2026-08-12" },
    { id: "INV-1045", customer: "Ama K.", amount: 1850, status: "Draft", issued: "2026-08-24", due: "2026-09-10" },
  ],
  expenses: [
    { id: "e1", name: "Office Rent", amount: 1200, category: "Rent", date: "2026-08-05" },
    { id: "e2", name: "Internet", amount: 80, category: "Utilities", date: "2026-08-08" },
    { id: "e3", name: "Accounting software", amount: 49, category: "Software", date: "2026-08-14" },
    { id: "e4", name: "Office supplies", amount: 96, category: "Supplies", date: "2026-09-08" },
  ],
  vendors: [
    { id: "v1", name: "Office Supplies Ltd", contact: "024 000 0000", email: "info@office.com" },
    { id: "v2", name: "City Utilities", contact: "030 111 2222", email: "billing@cityutil.com" },
  ],
  customers: [
    { id: "c1", name: "John Doe", email: "john@example.com", balance: 2400 },
    { id: "c2", name: "Ama K.", email: "ama@example.com", balance: 1850 },
    { id: "c3", name: "Northwind Ltd", email: "ap@northwind.com", balance: 1350 },
  ],
  subscribers: [
    { id: "s1", name: "Ama K.", plan: "Professional", status: "Active", renew: "2026-09-10" },
    { id: "s2", name: "John D.", plan: "Starter", status: "Active", renew: "2026-09-25" },
    { id: "s3", name: "Northwind Ltd", plan: "Business", status: "Suspended", renew: "2026-08-30" },
  ],
  banks: [
    { id: "b1", name: "Operating checking", bank: "First National", last4: "4412", balance: 18420 },
    { id: "b2", name: "Tax savings", bank: "First National", last4: "8891", balance: 3600 },
  ],
};

function readAuth() {
  try {
    return sessionStorage.getItem(AUTH_KEY) === "1";
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

function loadBooks() {
  try {
    const raw = localStorage.getItem(BOOKS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        transactions: parsed.transactions ?? seed.transactions,
        invoices: parsed.invoices ?? seed.invoices,
        expenses: parsed.expenses ?? seed.expenses,
        vendors: parsed.vendors ?? seed.vendors,
        customers: parsed.customers ?? seed.customers,
        subscribers: parsed.subscribers ?? seed.subscribers,
        banks: parsed.banks ?? seed.banks,
      };
    }
  } catch {
    /* ignore */
  }
  return seed;
}

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuth);
  const [user, setUser] = useState(readUser);
  const [books, setBooks] = useState(loadBooks);
  const { transactions, invoices, expenses, vendors, customers, subscribers, banks = [] } = books;

  useEffect(() => {
    try {
      localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    } catch {
      /* ignore */
    }
  }, [books]);

  const signIn = (profile) => {
    setUser(profile);
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem(AUTH_KEY, "1");
      sessionStorage.setItem(USER_KEY, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
  };

  const addTransaction = (item) => {
    setBooks((current) => ({
      ...current,
      transactions: [{ id: createId(), ...item }, ...current.transactions],
    }));
  };

  const removeTransaction = (id) => {
    setBooks((current) => ({
      ...current,
      transactions: current.transactions.filter((item) => item.id !== id),
    }));
  };

  const addInvoice = (item) => {
    setBooks((current) => {
      const nums = current.invoices.map((invoice) => Number(String(invoice.id).replace(/\D/g, "")) || 0);
      const next = Math.max(1045, ...nums) + 1;
      return {
        ...current,
        invoices: [
          {
            id: `INV-${next}`,
            status: "Draft",
            issued: new Date().toISOString().slice(0, 10),
            ...item,
          },
          ...current.invoices,
        ],
      };
    });
  };

  const updateInvoiceStatus = (id, status) => {
    setBooks((current) => ({
      ...current,
      invoices: current.invoices.map((item) => (item.id === id ? { ...item, status } : item)),
    }));
  };

  const addExpense = (item) => {
    setBooks((current) => ({
      ...current,
      expenses: [{ id: createId(), ...item }, ...current.expenses],
      transactions: [
        {
          id: createId(),
          date: item.date,
          description: item.name,
          category: item.category || "Expense",
          type: "expense",
          amount: item.amount,
        },
        ...current.transactions,
      ],
    }));
  };

  const removeExpense = (id) => {
    setBooks((current) => ({
      ...current,
      expenses: current.expenses.filter((item) => item.id !== id),
    }));
  };

  const addVendor = (item) => {
    setBooks((current) => ({
      ...current,
      vendors: [{ id: createId(), ...item }, ...current.vendors],
    }));
  };

  const removeVendor = (id) => {
    setBooks((current) => ({
      ...current,
      vendors: current.vendors.filter((item) => item.id !== id),
    }));
  };

  const addCustomer = (item) => {
    setBooks((current) => ({
      ...current,
      customers: [{ id: createId(), balance: 0, ...item }, ...current.customers],
    }));
  };

  const removeCustomer = (id) => {
    setBooks((current) => ({
      ...current,
      customers: current.customers.filter((item) => item.id !== id),
    }));
  };

  const addSubscriber = (item) => {
    setBooks((current) => ({
      ...current,
      subscribers: [{ id: createId(), ...item }, ...current.subscribers],
    }));
  };

  const updateSubscriberStatus = (id, status) => {
    setBooks((current) => ({
      ...current,
      subscribers: current.subscribers.map((item) => (item.id === id ? { ...item, status } : item)),
    }));
  };

  const addBank = (item) => {
    setBooks((current) => ({
      ...current,
      banks: [{ id: createId(), ...item }, ...(current.banks || [])],
    }));
  };

  const removeBank = (id) => {
    setBooks((current) => ({
      ...current,
      banks: (current.banks || []).filter((item) => item.id !== id),
    }));
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
    const cash = (books.banks || [])
      .reduce((sum, item) => sum + Number(item.balance || 0), 0);
    return {
      income,
      expenses: expenseTotal,
      net: income - expenseTotal,
      outstanding,
      cash,
    };
  }, [transactions, invoices, books.banks]);

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
    banks,
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
    addBank,
    removeBank,
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
