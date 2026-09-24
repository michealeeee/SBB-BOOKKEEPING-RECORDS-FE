import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PLANS, getPlan } from "../data/plans";
import { EMAIL_PATTERN, validateFormRecord } from "../data/models";
import { customerLabel } from "../utils/entities";

/* Context files export the provider and a hook together. */
/* eslint-disable react-refresh/only-export-components */

const AUTH_KEY = "bookkeeply-auth";
const USER_KEY = "bookkeeply-user";
const BOOKS_KEY = "bookkeeply-books-v4";

const AppContext = createContext(null);

function createId(prefix = "id") {
  const raw = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${raw.slice(0, 8)}`;
}

const BUSINESS_ID = "biz-demo";
const OWNER_ID = "usr-alex";
const STAFF_ID = "usr-staff";
const SUB_ID = "sub-demo";

const seedUsers = [
  {
    userid: OWNER_ID,
    first_name: "Alex",
    last_name: "Mensah",
    email: "alex@bookkeeply.app",
    created_at: "2026-07-01",
  },
  {
    userid: STAFF_ID,
    first_name: "Efua",
    last_name: "Boateng",
    email: "efua@northwind.example",
    created_at: "2026-08-01",
  },
];

const seed = {
  users: seedUsers,
  business: {
    businessid: BUSINESS_ID,
    name: "Northwind Books",
    email: "hello@northwind.example",
    phone: "030 111 0000",
    address: "",
    created_by: OWNER_ID,
    created_at: "2026-07-01",
    updated_at: "2026-09-01",
  },
  members: [
    {
      userid: OWNER_ID,
      businessid: BUSINESS_ID,
      first_name: "Alex",
      last_name: "Mensah",
      email: "alex@bookkeeply.app",
      role: "owner",
      active: true,
      created_at: "2026-07-01",
      updated_at: "2026-07-01",
    },
    {
      userid: STAFF_ID,
      businessid: BUSINESS_ID,
      first_name: "Efua",
      last_name: "Boateng",
      email: "efua@northwind.example",
      role: "staff",
      active: true,
      created_at: "2026-08-01",
      updated_at: "2026-08-01",
    },
  ],
  customers: [
    {
      customerid: "cus-ama",
      businessid: BUSINESS_ID,
      first_name: "Ama",
      last_name: "Kusi",
      business_name: "",
      email: "ama@example.com",
      phone_number: "024 000 0000",
      address: "East Legon, Accra",
      created_at: "2026-07-12",
      updated_at: "2026-07-12",
    },
    {
      customerid: "cus-john",
      businessid: BUSINESS_ID,
      first_name: "John",
      last_name: "Doe",
      business_name: "",
      email: "john@example.com",
      phone_number: "024 111 2222",
      address: "Tema",
      created_at: "2026-07-20",
      updated_at: "2026-07-20",
    },
    {
      customerid: "cus-north",
      businessid: BUSINESS_ID,
      first_name: "",
      last_name: "",
      business_name: "Northwind Ltd",
      email: "ap@northwind.com",
      phone_number: "030 555 0100",
      address: "Airport City",
      created_at: "2026-07-04",
      updated_at: "2026-07-04",
    },
  ],
  invoices: [
    {
      invoice_no: "INV-1042",
      customer_id: "cus-ama",
      businessid: BUSINESS_ID,
      amount: 1850,
      due_date: "2026-08-15",
      status: "paid",
      created_at: "2026-08-01",
      updated_at: "2026-08-08",
    },
    {
      invoice_no: "INV-1043",
      customer_id: "cus-john",
      businessid: BUSINESS_ID,
      amount: 2400,
      due_date: "2026-08-31",
      status: "unpaid",
      created_at: "2026-08-10",
      updated_at: "2026-08-10",
    },
    {
      invoice_no: "INV-1044",
      customer_id: "cus-north",
      businessid: BUSINESS_ID,
      amount: 1350,
      due_date: "2026-08-12",
      status: "partial",
      created_at: "2026-07-12",
      updated_at: "2026-07-20",
    },
  ],
  income: [
    {
      incomeid: "inc-1",
      businessid: BUSINESS_ID,
      invoiceid: null,
      source: "Services",
      amount: 4200,
      description: "Website redesign project",
      transaction_date: "2026-08-02",
      created_at: "2026-08-02",
      updated_at: "2026-08-02",
    },
    {
      incomeid: "inc-2",
      businessid: BUSINESS_ID,
      invoiceid: "INV-1042",
      source: "Consulting",
      amount: 1850,
      description: "Payment for INV-1042",
      transaction_date: "2026-08-08",
      created_at: "2026-08-08",
      updated_at: "2026-08-08",
    },
    {
      incomeid: "inc-3",
      businessid: BUSINESS_ID,
      invoiceid: null,
      source: "Sales",
      amount: 3120,
      description: "Product sales",
      transaction_date: "2026-08-18",
      created_at: "2026-08-18",
      updated_at: "2026-08-18",
    },
    {
      incomeid: "inc-4",
      businessid: BUSINESS_ID,
      invoiceid: null,
      source: "Consulting",
      amount: 2100,
      description: "Retainer — Northwind Ltd",
      transaction_date: "2026-09-03",
      created_at: "2026-09-03",
      updated_at: "2026-09-03",
    },
  ],
  expenses: [
    {
      expenseid: "exp-1",
      businessid: BUSINESS_ID,
      category: "Rent",
      amount: 1200,
      description: "Office rent",
      expense_date: "2026-08-05",
      created_at: "2026-08-05",
      updated_at: "2026-08-05",
    },
    {
      expenseid: "exp-2",
      businessid: BUSINESS_ID,
      category: "Utilities",
      amount: 180,
      description: "Internet & utilities",
      expense_date: "2026-08-22",
      created_at: "2026-08-22",
      updated_at: "2026-08-22",
    },
    {
      expenseid: "exp-3",
      businessid: BUSINESS_ID,
      category: "Software",
      amount: 240,
      description: "Software subscriptions",
      expense_date: "2026-08-12",
      created_at: "2026-08-12",
      updated_at: "2026-08-12",
    },
    {
      expenseid: "exp-4",
      businessid: BUSINESS_ID,
      category: "Supplies",
      amount: 96,
      description: "Office supplies",
      expense_date: "2026-09-08",
      created_at: "2026-09-08",
      updated_at: "2026-09-08",
    },
  ],
  vendors: [
    {
      vendorid: "ven-1",
      businessid: BUSINESS_ID,
      business_name: "Office Supplies Ltd",
      contact_person: "Kofi Mensah",
      email: "info@office.com",
      phone: "024 000 0000",
      address: "Kaneshie",
      created_at: "2026-07-15",
      updated_at: "2026-07-15",
    },
    {
      vendorid: "ven-2",
      businessid: BUSINESS_ID,
      business_name: "City Utilities",
      contact_person: "Billing desk",
      email: "billing@cityutil.com",
      phone: "030 111 2222",
      address: "Accra Central",
      created_at: "2026-07-18",
      updated_at: "2026-07-18",
    },
  ],
  subscription: {
    subscriptionid: SUB_ID,
    businessid: BUSINESS_ID,
    planid: "pro",
    status: "active",
    start_date: "2026-08-19",
    end_date: "2026-09-19",
    created_at: "2026-08-19",
    updated_at: "2026-08-19",
  },
  payments: [
    {
      paymentid: "pay-1",
      userid: OWNER_ID,
      subscriptionid: SUB_ID,
      amount: 19,
      payment_method: "card",
      transaction_reference: "demo-ref-4412",
      status: "success",
      created_at: "2026-08-19",
    },
  ],
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addMonthsISO(iso, months) {
  const date = new Date(`${iso}T00:00:00`);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

function readAuth() {
  try {
    return sessionStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

function defaultSessionUser() {
  const owner = seed.members[0];
  return {
    userid: owner.userid,
    first_name: owner.first_name,
    last_name: owner.last_name,
    email: owner.email,
  };
}

function readUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.email) {
        return {
          userid: parsed.userid || OWNER_ID,
          first_name: parsed.first_name || "",
          last_name: parsed.last_name || "",
          email: parsed.email,
        };
      }
    }
  } catch {
    /* ignore */
  }
  return defaultSessionUser();
}

function loadBooks() {
  try {
    const raw = localStorage.getItem(BOOKS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          ...seed,
          ...parsed,
          users: Array.isArray(parsed.users) ? parsed.users : seed.users,
          business: parsed.business || seed.business,
          members: Array.isArray(parsed.members) ? parsed.members : seed.members,
          customers: Array.isArray(parsed.customers) ? parsed.customers : seed.customers,
          invoices: Array.isArray(parsed.invoices) ? parsed.invoices : seed.invoices,
          income: Array.isArray(parsed.income) ? parsed.income : seed.income,
          expenses: Array.isArray(parsed.expenses) ? parsed.expenses : seed.expenses,
          vendors: Array.isArray(parsed.vendors) ? parsed.vendors : seed.vendors,
          subscription: parsed.subscription || seed.subscription,
          payments: Array.isArray(parsed.payments) ? parsed.payments : seed.payments,
        };
      }
    }
  } catch {
    /* ignore */
  }
  return seed;
}

function withinLimit(count, max) {
  return !max || max <= 0 || count < max;
}

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuth);
  const [user, setUser] = useState(readUser);
  const [books, setBooks] = useState(loadBooks);

  const {
    users,
    business,
    members,
    customers,
    invoices,
    income,
    expenses,
    vendors,
    subscription,
    payments,
  } = books;

  useEffect(() => {
    try {
      localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    } catch {
      /* ignore */
    }
  }, [books]);

  const membership = useMemo(
    () => members.find((item) => item.userid === user.userid) || members.find((item) => item.role === "owner"),
    [members, user.userid]
  );

  const plan = getPlan(subscription?.planid);

  const publicUser = (record) => ({
    userid: record.userid,
    first_name: record.first_name || "",
    last_name: record.last_name || "",
    email: record.email,
    created_at: record.created_at || todayISO(),
  });

  const signIn = (profile) => {
    const existing =
      books.users?.find((item) => item.email?.toLowerCase() === profile.email?.toLowerCase()) ||
      books.members?.find((item) => item.email?.toLowerCase() === profile.email?.toLowerCase());
    const nextUser = publicUser({
      userid: profile.userid || existing?.userid || createId("usr"),
      first_name: profile.first_name || existing?.first_name || "",
      last_name: profile.last_name || existing?.last_name || "",
      email: profile.email,
      created_at: profile.created_at || existing?.created_at || todayISO(),
    });
    setUser(nextUser);
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem(AUTH_KEY, "1");
      sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } catch {
      /* ignore */
    }
  };

  const registerBusiness = (profile) => {
    const userCheck = validateFormRecord("user", {
      first_name: profile.first_name,
      email: profile.email,
    });
    if (!userCheck.ok) return userCheck;
    const businessCheck = validateFormRecord("business", { name: profile.business_name });
    if (!businessCheck.ok) return businessCheck;
    if (!EMAIL_PATTERN.test(profile.email || "")) {
      return { error: "Enter a valid email address." };
    }

    const userid = createId("usr");
    const businessid = createId("biz");
    const subscriptionid = createId("sub");
    const planid = PLANS.some((item) => item.planid === profile.planid) ? profile.planid : "basic";
    const selected = getPlan(planid);
    const start = todayISO();
    const nextUser = publicUser({
      userid,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      created_at: start,
    });

    setBooks({
      users: [nextUser],
      business: {
        businessid,
        name: profile.business_name,
        email: profile.business_email || profile.email,
        phone: profile.phone || "",
        address: profile.address || "",
        created_by: userid,
        created_at: start,
        updated_at: start,
      },
      members: [
        {
          userid,
          businessid,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          role: "owner",
          active: true,
          created_at: start,
          updated_at: start,
        },
      ],
      customers: [],
      invoices: [],
      income: [],
      expenses: [],
      vendors: [],
      subscription: {
        subscriptionid,
        businessid,
        planid,
        status: "active",
        start_date: start,
        end_date: addMonthsISO(start, 1),
        created_at: start,
        updated_at: start,
      },
      payments: [
        {
          paymentid: createId("pay"),
          userid,
          subscriptionid,
          amount: selected.price,
          payment_method: "demo",
          transaction_reference: createId("ref"),
          status: "pending",
          created_at: start,
        },
      ],
    });
    signIn(nextUser);
    return { ok: true };
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

  const updateBusiness = (fields) => {
    const check = validateFormRecord("business", { name: fields.name });
    if (!check.ok) return check;
    setBooks((current) => ({
      ...current,
      business: {
        ...current.business,
        ...fields,
        updated_at: todayISO(),
      },
    }));
    return { ok: true };
  };

  const addMember = (item) => {
    const userCheck = validateFormRecord("user", {
      first_name: item.first_name,
      email: item.email,
    });
    if (!userCheck.ok) return userCheck;
    if (!EMAIL_PATTERN.test(item.email || "")) {
      return { error: "Enter a valid email address." };
    }
    const planLimits = getPlan(books.subscription.planid);
    if (!withinLimit(books.members.length, planLimits.max_users)) {
      return { error: `This plan allows ${planLimits.max_users} users.` };
    }
    const userid = createId("usr");
    const created = todayISO();
    const nextUser = publicUser({
      userid,
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
      created_at: created,
    });
    setBooks((current) => ({
      ...current,
      users: [nextUser, ...(current.users || []).filter((user) => user.email !== item.email)],
      members: [
        {
          userid,
          businessid: current.business.businessid,
          first_name: item.first_name,
          last_name: item.last_name,
          email: item.email,
          role: item.role || "staff",
          active: item.active !== false,
          created_at: created,
          updated_at: created,
        },
        ...current.members,
      ],
    }));
    return { ok: true };
  };

  const updateMember = (userid, fields) => {
    setBooks((current) => ({
      ...current,
      members: current.members.map((item) =>
        item.userid === userid ? { ...item, ...fields, updated_at: todayISO() } : item
      ),
    }));
  };

  const addCustomer = (item) => {
    if (!String(item.first_name || "").trim() && !String(item.business_name || "").trim()) {
      return { error: "Add a person name or a customer business name." };
    }
    if (item.email && !EMAIL_PATTERN.test(item.email)) {
      return { error: "Enter a valid email or leave it blank." };
    }
    const planLimits = getPlan(books.subscription.planid);
    if (!withinLimit(books.customers.length, planLimits.max_customers)) {
      return { error: `This plan allows ${planLimits.max_customers} customers.` };
    }
    setBooks((current) => ({
      ...current,
      customers: [
        {
          customerid: createId("cus"),
          businessid: current.business.businessid,
          first_name: item.first_name || "",
          last_name: item.last_name || "",
          business_name: item.business_name || "",
          email: item.email || "",
          phone_number: item.phone_number || "",
          address: item.address || "",
          created_at: todayISO(),
          updated_at: todayISO(),
        },
        ...current.customers,
      ],
    }));
    return { ok: true };
  };

  const removeCustomer = (customerid) => {
    setBooks((current) => ({
      ...current,
      customers: current.customers.filter((item) => item.customerid !== customerid),
    }));
  };

  const addInvoice = (item) => {
    const check = validateFormRecord("invoice", item);
    if (!check.ok) return check;
    if (Number(item.amount) <= 0) {
      return { error: "Amount must be greater than zero." };
    }
    const planLimits = getPlan(books.subscription.planid);
    if (!withinLimit(books.invoices.length, planLimits.max_invoices)) {
      return { error: `This plan allows ${planLimits.max_invoices} invoices.` };
    }
    setBooks((current) => {
      const nums = current.invoices.map((invoice) => Number(String(invoice.invoice_no).replace(/\D/g, "")) || 0);
      const next = Math.max(1045, ...nums) + 1;
      return {
        ...current,
        invoices: [
          {
            invoice_no: `INV-${next}`,
            customer_id: item.customer_id || null,
            businessid: current.business.businessid,
            amount: item.amount,
            due_date: item.due_date || "",
            status: item.status || "unpaid",
            created_at: todayISO(),
            updated_at: todayISO(),
          },
          ...current.invoices,
        ],
      };
    });
    return { ok: true };
  };

  const updateInvoiceStatus = (invoice_no, status) => {
    setBooks((current) => ({
      ...current,
      invoices: current.invoices.map((item) =>
        item.invoice_no === invoice_no ? { ...item, status, updated_at: todayISO() } : item
      ),
    }));
  };

  const addIncome = (item) => {
    const check = validateFormRecord("income", item);
    if (!check.ok) return check;
    if (Number(item.amount) <= 0) {
      return { error: "Amount must be greater than zero." };
    }
    setBooks((current) => ({
      ...current,
      income: [
        {
          incomeid: createId("inc"),
          businessid: current.business.businessid,
          invoiceid: item.invoiceid || null,
          source: item.source || "",
          amount: item.amount,
          description: item.description || "",
          transaction_date: item.transaction_date,
          created_at: todayISO(),
          updated_at: todayISO(),
        },
        ...current.income,
      ],
    }));
    return { ok: true };
  };

  const removeIncome = (incomeid) => {
    setBooks((current) => ({
      ...current,
      income: current.income.filter((item) => item.incomeid !== incomeid),
    }));
  };

  const addExpense = (item) => {
    const check = validateFormRecord("expense", item);
    if (!check.ok) return check;
    if (Number(item.amount) <= 0) {
      return { error: "Amount must be greater than zero." };
    }
    setBooks((current) => ({
      ...current,
      expenses: [
        {
          expenseid: createId("exp"),
          businessid: current.business.businessid,
          category: item.category || "",
          amount: item.amount,
          description: item.description || "",
          expense_date: item.expense_date,
          created_at: todayISO(),
          updated_at: todayISO(),
        },
        ...current.expenses,
      ],
    }));
    return { ok: true };
  };

  const removeExpense = (expenseid) => {
    setBooks((current) => ({
      ...current,
      expenses: current.expenses.filter((item) => item.expenseid !== expenseid),
    }));
  };

  const addVendor = (item) => {
    const check = validateFormRecord("vendor", item);
    if (!check.ok) return check;
    if (item.email && !EMAIL_PATTERN.test(item.email)) {
      return { error: "Enter a valid email or leave it blank." };
    }
    setBooks((current) => ({
      ...current,
      vendors: [
        {
          vendorid: createId("ven"),
          businessid: current.business.businessid,
          business_name: item.business_name,
          contact_person: item.contact_person || "",
          email: item.email || "",
          phone: item.phone || "",
          address: item.address || "",
          created_at: todayISO(),
          updated_at: todayISO(),
        },
        ...current.vendors,
      ],
    }));
    return { ok: true };
  };

  const removeVendor = (vendorid) => {
    setBooks((current) => ({
      ...current,
      vendors: current.vendors.filter((item) => item.vendorid !== vendorid),
    }));
  };

  const choosePlan = (planid) => {
    const selected = getPlan(planid);
    const start = todayISO();
    setBooks((current) => {
      const subscriptionid = current.subscription?.subscriptionid || createId("sub");
      return {
        ...current,
        subscription: {
          subscriptionid,
          businessid: current.business.businessid,
          planid: selected.planid,
          status: "active",
          start_date: start,
          end_date: addMonthsISO(start, 1),
          created_at: current.subscription?.created_at || start,
          updated_at: start,
        },
        payments: [
          {
            paymentid: createId("pay"),
            userid: user.userid,
            subscriptionid,
            amount: selected.price,
            payment_method: "demo",
            transaction_reference: createId("ref"),
            status: "pending",
            created_at: start,
          },
          ...current.payments,
        ],
      };
    });
  };

  const ledger = useMemo(() => {
    const incomeRows = income.map((item) => ({
      id: item.incomeid,
      date: item.transaction_date,
      description: item.description || item.source,
      category: item.source,
      type: "income",
      amount: item.amount,
    }));
    const expenseRows = expenses.map((item) => ({
      id: item.expenseid,
      date: item.expense_date,
      description: item.description || item.category,
      category: item.category,
      type: "expense",
      amount: item.amount,
    }));
    return [...incomeRows, ...expenseRows].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }, [income, expenses]);

  const addLedgerEntry = (item) => {
    if (item.type === "expense") {
      return addExpense({
        category: item.category,
        amount: item.amount,
        description: item.description,
        expense_date: item.date,
      });
    }
    return addIncome({
      source: item.category,
      amount: item.amount,
      description: item.description,
      transaction_date: item.date,
      invoiceid: null,
    });
  };

  const removeLedgerEntry = (id) => {
    if (String(id).startsWith("exp-") || expenses.some((item) => item.expenseid === id)) {
      removeExpense(id);
      return;
    }
    removeIncome(id);
  };

  const totals = useMemo(() => {
    const incomeTotal = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const expenseTotal = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const outstanding = invoices
      .filter((item) => item.status !== "paid")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return {
      income: incomeTotal,
      expenses: expenseTotal,
      net: incomeTotal - expenseTotal,
      outstanding,
    };
  }, [income, expenses, invoices]);

  const findCustomer = (customerid) => customers.find((item) => item.customerid === customerid);

  const value = {
    isAuthenticated,
    user,
    users,
    business,
    membership,
    members,
    customers,
    invoices,
    income,
    expenses,
    vendors,
    subscription,
    payments,
    plan,
    plans: PLANS,
    ledger,
    transactions: ledger,
    totals,
    customerLabel,
    findCustomer,
    signIn,
    registerBusiness,
    signOut,
    updateBusiness,
    addMember,
    updateMember,
    addCustomer,
    removeCustomer,
    addInvoice,
    updateInvoiceStatus,
    addIncome,
    removeIncome,
    addExpense,
    removeExpense,
    addVendor,
    removeVendor,
    choosePlan,
    addTransaction: addLedgerEntry,
    removeTransaction: removeLedgerEntry,
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
