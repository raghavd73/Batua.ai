// src/App.jsx
import React from "react";
import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopNav from "./components/TopNav.jsx";
import Footer from "./components/Footer.jsx";

import Landing from "./pages/Landing.jsx";
import WhyBatua from "./pages/WhyBatua.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Budgeting from "./pages/Budgeting.jsx";
import Investing from "./pages/Investing.jsx";
import StocksPage from "./pages/StocksPage.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx";
import MutualFundsPage from "./pages/MutualFundsPage.jsx";
import FNOPage from "./pages/FNOPage.jsx";
import TaxReduction from "./pages/TaxReduction.jsx";
import TaxReductionPage from "./pages/TaxReductionPage.jsx";
import BudgetingPage from "./pages/BudgetingPage.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import YourBatua from "./pages/YourBatua.jsx";
import StockDetailsPage from "./pages/StockDetailsPage";
import Dashboard from "./pages/Dashboard.jsx";

// Splitwise
import SplitwiseHome from "./pages/SplitwiseHome.jsx";
import GroupDetails from "./pages/GroupDetails.jsx";
import AddExpense from "./pages/AddExpense.jsx";

function Home() {
  return (
    <>
      <Landing />
      <WhyBatua />
      <HowItWorks />
      <Investing />
      <Budgeting />
      <TaxReduction />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budgeting" element={<BudgetingPage />} />
        <Route path="/mutual-funds" element={<MutualFundsPage />} />
        <Route path="/stocks" element={<StocksPage />} />
        <Route path="/stock/mrpl" element={<StockDetailsPage />} />
        <Route path="/stocks/:symbol" element={<StockDetailsPage />} />
        <Route path="/tax-reduction" element={<TaxReductionPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/fno" element={<FNOPage />} />
        <Route path="/get-started" element={<Onboarding />} />
        <Route path="/your-batua" element={<YourBatua />} />

        {/* Splitwise routes */}
        <Route path="/splitwise" element={<SplitwiseHome />} />
        <Route path="/splitwise/group/:id" element={<GroupDetails />} />
        <Route path="/splitwise/group/:id/add-expense" element={<AddExpense />} />

        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
