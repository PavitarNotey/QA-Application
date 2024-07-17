import React from "react";
import "./styles/InspectionPage.css";

// Function for prompting if an inspection piece is approved or rejected.
function InspectionPage({ onApprove, onReject }) {
  return (
    <div className="ApproveReject">
      <button className="Approval" onClick={onApprove}>
        Approved
      </button>
      <button className="Rejection" onClick={onReject}>
        Rejected
      </button>
    </div>
  );
}

export default InspectionPage;
