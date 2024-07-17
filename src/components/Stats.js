import React from "react";
import "./styles/Stats.css";

// Function for displaying the stats.
const Stats = ({
  inspectedCount,
  acceptedCount,
  rejectedCount,
  listOfWorkOrders,
  rejectionStats,
}) => {
  const rejectionPercentage = inspectedCount
    ? ((rejectedCount / inspectedCount) * 100).toFixed(2)
    : 0;

  return (
    <div className="stats">
      {/* Rejection stats. */}
      <h2>Statistics</h2>
      <h3>Work Order Stats</h3>
      <ul>
        {listOfWorkOrders.map((order, index) => (
          <li key={index}>
            <strong>Work Order Number: {order.workOrderNumber}</strong>
            <ul>
              <li>Total Inspected: {order.totalInspected}</li>
              <li>Total Accepted: {order.totalAccepted}</li>
              <li>Total Rejected: {order.totalRejected}</li>
            </ul>
          </li>
        ))}
      </ul>

      <h3>General Stats</h3>
      <p>Total Inspected: {inspectedCount}</p>
      <p>Total Accepted: {acceptedCount}</p>
      <p>Total Rejected: {rejectedCount}</p>
      <p className="pie">Rejection Percentage: {rejectionPercentage}%</p>

      {/* Displaying the types of rejections. */}
      <h3>Rejection Stats</h3>
      <ul>
        {Object.keys(rejectionStats).map((category, index) => (
          <li key={index}>
            <strong>{category}</strong>
            <ul>
              {Object.keys(rejectionStats[category]).map((detail, subIndex) => (
                <li key={subIndex}>
                  {detail}: {rejectionStats[category][detail]}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stats;
