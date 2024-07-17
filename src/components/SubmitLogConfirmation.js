import React from "react";
import "./styles/SubmitLogConfirmation.css";

function SubmitLogConfirmation({ onConfirm }) {
  return (
    <div className="submit-log-confirmation">
      <p>Are you sure you want to submit the logs?</p>
      <button onClick={() => onConfirm(true)}>Yes</button>
      <button onClick={() => onConfirm(false)}>No</button>
    </div>
  );
}

export default SubmitLogConfirmation;
