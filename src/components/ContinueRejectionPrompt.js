import React from "react";
import "./styles/ContinueRejectionPrompt.css";

// Function for prompting if the user would like to submit a second rejection for the same piece.
function ContinueRejectionPrompt({ onConfirm, showInspectionComplete }) {
  return (
    <div className="continue-rejection-prompt">
      <h2>
        Would you like to submit another rejection for the same inspection?
      </h2>
      <button onClick={() => onConfirm(true)}>Yes</button>
      <button onClick={() => onConfirm(false)}>No</button>
    </div>
  );
}

export default ContinueRejectionPrompt;
