import React from "react";
import "./styles/Logs.css";

// Function for displaying the log.
const Logs = ({ inspectionLogs, handleDeleteLog, handleSubmitLogs }) => {
  return (
    <div className="logs">
      <button className="submit-logs-button" onClick={handleSubmitLogs}>
        Download Logs to Excel
      </button>
      <h2 className="Inspection-log-title">Inspection Logs</h2>
      <table id="inspection-table">
        <thead>
          <tr>
            <th>Piece Number</th>
            <th>Work Order Number</th>
            <th>Industry</th>
            <th>Product Number</th>
            <th>Inspector Name</th>
            <th>Inspector Employee Number</th>
            <th>Time</th>
            <th>Category</th>
            <th>Details</th>
            <th>Employee Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inspectionLogs.map((log) => (
            <tr key={log._id}>
              <td>{log.pieceNumber}</td>
              <td>{log.workOrderNumber}</td>
              <td>{log.industry}</td>
              <td>{log.productNumber}</td>
              <td>{log.inspectorName}</td>
              <td>{log.inspectorEmployeeNumber}</td>
              <td>{log.time}</td>
              <td>{log.category}</td>
              <td>{log.details}</td>
              <td>{log.employeeNumber}</td>
              <td>
                <button
                  // Delete log entry button.
                  className="delete-button"
                  onClick={() => handleDeleteLog(log._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;
