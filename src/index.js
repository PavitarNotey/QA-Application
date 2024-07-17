import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Import BrowserRouter
import FellFabNavbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <header>
        <FellFabNavbar />
      </header>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
      <div>
        <Footer />
      </div>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
