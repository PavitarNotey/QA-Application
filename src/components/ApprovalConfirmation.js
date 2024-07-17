import React, { useState } from "react";
import "./styles/ApprovalConfirmation.css";

// Prompt for confirmation of approval of inspection.
function ApprovalConfirmation({ onConfirm }) {
  const [quantity, setQuantity] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuantity(value);
  };

  const handleConfirm = (confirm) => {
    if (confirm) {
      const validQuantity = Math.max(Number(quantity), 1);
      onConfirm(true, validQuantity);
    } else {
      onConfirm(false);
    }
  };

  return (
    <div className="approval-confirmation">
      <div>
        <h2>Confirm Approval</h2>
        Quantity :
        <input
          type="number"
          value={quantity}
          onChange={handleChange}
          min="1"
          placeholder="1"
          className="quantity-input"
        />
      </div>
      <button onClick={() => handleConfirm(true)}>Yes</button>
      <button onClick={() => handleConfirm(false)}>No</button>
    </div>
  );
}

export default ApprovalConfirmation;
