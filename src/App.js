import React from "react";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Add more routes here as needed */}
    </Routes>
  );
}

export default App;
