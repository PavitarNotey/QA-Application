import React, { useState } from "react";
import "./styles/RejectionConfirmation.css";

// Function for prompting the details for confirming the rejection.
function RejectionConfirmation({ rejectionDetails, onConfirm }) {
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
    <div className="RejectionConfirmation">
      <h2>Confirmed Rejection</h2>
      <p>{rejectionDetails}</p>
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
      <button onClick={() => handleConfirm(true)}>OK</button>
    </div>
  );
}

export default RejectionConfirmation;
