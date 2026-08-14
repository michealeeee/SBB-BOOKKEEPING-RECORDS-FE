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



  const changePage = (selectedPage) => {

    setPage(selectedPage);

    setMobileOpen(false);

  };



  const renderPage = () => {

    switch(page){

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


        <Route 
          path="/signup"
          element={<SignUp />}
        />


        <Route 
          path="/signin"
          element={<SignIn />}
        />



        <Route

          path="/*"

          element={

            <div className="dashboard-shell">


              {isAuthenticated ? (

                <LandingPage />

              ) : (

                <>


                  {/* DASHBOARD NAVBAR */}

                  <nav className="dashboard-navbar">


                    <div className="dashboard-logo">

                      Bookkeeply

                    </div>



                    {/* DESKTOP MENU */}

                    <div className="dashboard-desktop-menu">


                      <button onClick={() => changePage("dashboard")}>
                        Dashboard
                      </button>


                      <button onClick={() => changePage("transactions")}>
                        Transactions
                      </button>


                      <button onClick={() => changePage("invoices")}>
                        Invoices
                      </button>


                      <button onClick={() => changePage("reports")}>
                        Reports
                      </button>


                      <button onClick={() => changePage("expenses")}>
                        Expenses
                      </button>


                      <button onClick={() => changePage("vendors")}>
                        Vendors
                      </button>


                      <button onClick={() => changePage("customers")}>
                        Customers
                      </button>


                      <button onClick={() => changePage("taxes")}>
                        Taxes
                      </button>


                    </div>




                    {/* MOBILE TOGGLE */}

                    <button

                      className="dashboard-toggle"

                      onClick={() => setMobileOpen(!mobileOpen)}

                    >

                      <span>

                        {mobileOpen ? "✕" : "☰"}

                      </span>


                    </button>



                  </nav>





                  {/* MOBILE DRAWER */}

                  <div

                    className={
                      `dashboard-mobile-menu ${
                        mobileOpen ? "open" : ""
                      }`
                    }

                  >


                    <button onClick={() => changePage("dashboard")}>
                      Dashboard
                    </button>


                    <button onClick={() => changePage("transactions")}>
                      Transactions
                    </button>


                    <button onClick={() => changePage("invoices")}>
                      Invoices
                    </button>


                    <button onClick={() => changePage("reports")}>
                      Reports
                    </button>


                    <button onClick={() => changePage("expenses")}>
                      Expenses
                    </button>


                    <button onClick={() => changePage("vendors")}>
                      Vendors
                    </button>


                    <button onClick={() => changePage("customers")}>
                      Customers
                    </button>


                    <button onClick={() => changePage("taxes")}>
                      Taxes
                    </button>


                  </div>





                  {/* PAGE CONTENT */}

                  <main className="dashboard-main-content">

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