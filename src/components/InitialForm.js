// src/components/InitialForm.js
import React from "react";
import "./styles/InitialForm.css";

// Initial form for data collection.
const InitialForm = ({
  workOrderNumber,
  setWorkOrderNumber,
  industry,
  setIndustry,
  productNumber,
  setProductNumber,
  inspectorName,
  setInspectorName,
  inspectorEmployeeNumber,
  setInspectorEmployeeNumber,
  handleFormSubmit,
}) => {
  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        {/* Field for Work Order Number. */}
        <label>Work Order Number:</label>
        <input
          type="text"
          value={workOrderNumber}
          onChange={(e) => setWorkOrderNumber(e.target.value.toUpperCase())}
          required
        />
      </div>
      <div>
        {/* Field for Industry */}
        <label>Industry or Work Center:</label>
        <input
          type="text"
          value={industry}
          onChange={(e) => setIndustry(e.target.value.toUpperCase())}
          required
        />
      </div>
      <div>
        {/* field for Product Number */}
        <label>Product Number or Part ID:</label>
        <input
          type="text"
          value={productNumber}
          onChange={(e) => setProductNumber(e.target.value.toUpperCase())}
          required
        />
      </div>
      <div>
        {/* Field for Inspection Name */}
        <label>Inspector Name:</label>
        <input
          type="text"
          value={inspectorName}
          onChange={(e) => setInspectorName(e.target.value.toUpperCase())}
          required
        />
      </div>
      <div>
        {/* Field for Inspectors Employee Number */}
        <label>Inspector Employee Number:</label>
        <input
          type="number"
          value={inspectorEmployeeNumber}
          onChange={(e) => setInspectorEmployeeNumber(e.target.value)}
          required
        />
      </div>
      <button type="submit">Proceed</button>
    </form>
  );
};

export default InitialForm;
