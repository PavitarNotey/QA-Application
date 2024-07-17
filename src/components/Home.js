import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import InspectionPage from "./InspectionPage";
import ApprovalConfirmation from "./ApprovalConfirmation";
import RejectionOptions from "./RejectionOptions";
import RejectionOptionsAdmin from "./RejectionOptionsAdmin";
import RejectionConfirmation from "./RejectionConfirmation";
import ContinueRejectionPrompt from "./ContinueRejectionPrompt";
import Stats from "./Stats";
import InitialForm from "./InitialForm";
import Logs from "./Logs";
import SubmitLogConfirmation from "./SubmitLogConfirmation";
import InstructionsModal from "./InstructionsModal";
import "./styles/Home.css";

const Home = () => {
  // Declaring all variables.
  const [pieceNumber, setPieceNumber] = useState(1);
  const [workOrderNumber, setWorkOrderNumber] = useState("");
  const [industry, setIndustry] = useState("");
  const [productNumber, setProductNumber] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [inspectorEmployeeNumber, setInspectorEmployeeNumber] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showApprovalConfirmation, setShowApprovalConfirmation] =
    useState(false);
  const [showRejectionOptions, setShowRejectionOptions] = useState(false);
  const [showRejectionConfirmation, setShowRejectionConfirmation] =
    useState(false);
  const [showContinueRejectionPrompt, setShowContinueRejectionPrompt] =
    useState(false);
  const [selectedRejectionCategory, setSelectedRejectionCategory] =
    useState("");
  const [selectedRejectionDetails, setSelectedRejectionDetails] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [inspectedCount, setInspectedCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [rejectionStats, setRejectionStats] = useState({});
  const [inspectionLogs, setInspectionLogs] = useState([]);
  const [isRejectionPending, setIsRejectionPending] = useState(false);
  const [isContinuation, setIsContinuation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logsSubmitted, setLogsSubmitted] = useState(false);
  const [listOfWorkOrders, setListOfWorkOrders] = useState([]);
  const [showSubmitLogConfirmation, setShowSubmitLogConfirmation] =
    useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [password, setPassword] = useState("");

  // Load saved logs from localStorage on mount.
  useEffect(() => {
    const savedLogs = localStorage.getItem("inspectionLogs");
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs);
      setInspectionLogs(parsedLogs);
      setPieceNumber(parsedLogs.length > 0 ? parsedLogs.length + 1 : 1);

      // Calculate accepted and rejected counts.
      let accepted = 0;
      let rejected = 0;
      const newRejectionStats = {};
      const updatedWorkOrders = [];

      parsedLogs.forEach((log) => {
        const existingWorkOrder = updatedWorkOrders.find(
          (workOrder) => workOrder.workOrderNumber === log.workOrderNumber
        );

        if (existingWorkOrder) {
          if (log.status === "Accepted") {
            existingWorkOrder.totalAccepted++;
            existingWorkOrder.totalInspected++;
          } else if (!log.isContinuation) {
            existingWorkOrder.totalRejected++;
            existingWorkOrder.totalInspected++;
          }
          // If its a new Work Order, then create the stats for display.
        } else {
          const newStat = {
            workOrderNumber: log.workOrderNumber,
            totalInspected: 1,
            totalAccepted: log.status === "Accepted" ? 1 : 0,
            totalRejected: log.status === "Rejected" ? 1 : 0,
          };
          updatedWorkOrders.push(newStat);
        }
        setListOfWorkOrders([...updatedWorkOrders]);
        if (log.status === "Accepted") {
          accepted++;
        } else if (log.status === "Rejected") {
          if (!newRejectionStats[log.category]) {
            newRejectionStats[log.category] = {};
          }
          if (!newRejectionStats[log.category][log.details]) {
            newRejectionStats[log.category][log.details] = 0;
          }
          newRejectionStats[log.category][log.details]++;
          if (!log.isContinuation) {
            rejected++;
          }
        }
      });

      // Setting values for stats.
      setAcceptedCount(accepted);
      setRejectedCount(rejected);
      setInspectedCount(accepted + rejected);
      setPieceNumber(accepted + rejected + 1);
      setRejectionStats(newRejectionStats);
      setListOfWorkOrders(updatedWorkOrders);
    }
  }, []);

  // Save logs to localStorage
  const saveLogsToLocalStorageButton = () => {
    localStorage.setItem("inspectionLogs", JSON.stringify(inspectionLogs));
    alert("Logs have been saved.");
  };

  // Handling approval logic.
  const handleApproval = () => {
    setShowApprovalConfirmation(true);
    setShowRejectionOptions(false);
    setShowRejectionConfirmation(false);
    setShowContinueRejectionPrompt(false);
    setShowSubmitLogConfirmation(false);

    if (isContinuation) {
      setPieceNumber(pieceNumber + 1);
      setIsContinuation(false);
    }
  };

  // Handle approval confirmation.
  const handleApprovalConfirmation = (confirmed, quantity = 1) => {
    if (confirmed) {
      const newLogs = [];

      // Loop for creating the amount of logs entered in the quantity box.
      for (let i = 0; i < quantity; i++) {
        const newLog = {
          _id: Math.random(),
          pieceNumber: pieceNumber + i,
          workOrderNumber,
          industry,
          productNumber,
          inspectorName,
          inspectorEmployeeNumber,
          status: "Accepted",
          time: new Date().toLocaleString(),
          category: "",
          details: "",
          employeeNumber: "",
          isContinuation: false,
        };

        // Add log to array to add to inspection logs and update the log specific stats.
        newLogs.push(newLog);
        handleLogSpecificStats(newLog);
      }

      // Adding the logs to the inspection logs, and updating the general stats.
      const updatedLogs = [...inspectionLogs, ...newLogs];
      setPieceNumber(pieceNumber + quantity);
      setAcceptedCount(acceptedCount + quantity);
      setInspectedCount(inspectedCount + quantity);
      setInspectionLogs([...inspectionLogs, ...newLogs]);
      localStorage.setItem("inspectionLogs", JSON.stringify(updatedLogs));
    }
    setShowApprovalConfirmation(false);
    setIsContinuation(false);
  };

  // Handle rejection logic.
  const handleRejection = () => {
    if (!isRejectionPending) {
      setShowSubmitLogConfirmation(false);
      setShowRejectionOptions(true);
      setShowApprovalConfirmation(false);
      setShowContinueRejectionPrompt(false);
    }
  };

  // Handle rejection selection.
  const handleRejectionSelection = (category, details, employeeNumber) => {
    setSelectedRejectionCategory(category);
    setSelectedRejectionDetails(details);
    setEmployeeNumber(employeeNumber);
    setShowRejectionOptions(false);
    setShowRejectionConfirmation(true);
    setIsRejectionPending(true);
  };

  // Handle rejection confirmation.
  const handleRejectionConfirmation = (confirmed, quantity = 1) => {
    if (confirmed) {
      const newLogs = [];

      // Loop for creating the amount of logs entered in the quantity box.
      for (let i = 0; i < quantity; i++) {
        // Adding details to add the type of rejection to the stats.
        const newRejectionStats = { ...rejectionStats };
        if (!newRejectionStats[selectedRejectionCategory]) {
          newRejectionStats[selectedRejectionCategory] = {};
        }
        if (
          !newRejectionStats[selectedRejectionCategory][
            selectedRejectionDetails
          ]
        ) {
          newRejectionStats[selectedRejectionCategory][
            selectedRejectionDetails
          ] = 0;
        }
        newRejectionStats[selectedRejectionCategory][
          selectedRejectionDetails
        ] += quantity;
        setRejectionStats(newRejectionStats);

        // Creating new log for the rejection.
        const newLog = {
          _id: Math.random(),
          pieceNumber: pieceNumber + i,
          time: new Date().toLocaleString(),
          status: "Rejected",
          category: selectedRejectionCategory,
          details: selectedRejectionDetails,
          workOrderNumber,
          industry,
          productNumber,
          employeeNumber,
          inspectorName,
          inspectorEmployeeNumber,
          isContinuation,
        };

        handleLogSpecificStats(newLog);
        newLogs.push(newLog);
      }
      // Updating stats for new log if the chose to not submit a second log for the same inspection.
      if (!isContinuation) {
        setRejectedCount(rejectedCount + quantity);
        setInspectedCount(inspectedCount + quantity);
      }

      const updatedLogs = [...inspectionLogs, ...newLogs];
      setPieceNumber(pieceNumber + quantity);
      setInspectionLogs([...inspectionLogs, ...newLogs]);
      setIsRejectionPending(false);
      setIsContinuation(false);
      localStorage.setItem("inspectionLogs", JSON.stringify(updatedLogs));
    }
    setShowRejectionConfirmation(false);
    if (quantity === 1) setShowContinueRejectionPrompt(true);
  };

  // Function to update the Work Order Specific Stats for when a log is created.
  const handleLogSpecificStats = (
    newLog,
    updatedWorkOrders = listOfWorkOrders
  ) => {
    const existingWorkOrder = updatedWorkOrders.find(
      (workOrder) => workOrder.workOrderNumber === newLog.workOrderNumber
    );

    if (existingWorkOrder) {
      if (newLog.status === "Accepted") {
        existingWorkOrder.totalAccepted++;
        existingWorkOrder.totalInspected++;
      } else if (!newLog.isContinuation) {
        existingWorkOrder.totalRejected++;
        existingWorkOrder.totalInspected++;
      }
      // If its a new Work Order, then create the stats for display
    } else {
      const newStat = {
        workOrderNumber: newLog.workOrderNumber,
        totalInspected: 1,
        totalAccepted: newLog.status === "Accepted" ? 1 : 0,
        totalRejected: newLog.status === "Rejected" ? 1 : 0,
      };
      updatedWorkOrders.push(newStat);
    }
    setListOfWorkOrders([...updatedWorkOrders]);
  };

  // Handle continuation of rejection for the same inspection piece.
  const handleContinueRejection = (continueRejection) => {
    setIsContinuation(continueRejection);
    if (continueRejection) {
      setPieceNumber(pieceNumber - 1);
      setShowRejectionOptions(true);
      setShowContinueRejectionPrompt(false);
    } else {
      setShowApprovalConfirmation(false);
      setShowRejectionOptions(false);
      setShowRejectionConfirmation(false);
      setShowContinueRejectionPrompt(false);
    }
  };

  // Function to re-index piece numbers after deletion
  const reIndexPieceNumbers = (logs) => {
    const updatedLogs = [];
    let currentPieceNumber = 0;
    let lastPieceNumber = null;

    logs.forEach((log) => {
      if (log.pieceNumber !== lastPieceNumber) {
        lastPieceNumber = log.pieceNumber;
        currentPieceNumber++;
      }
      updatedLogs.push({ ...log, pieceNumber: currentPieceNumber });
      if (currentPieceNumber !== 1) {
        setPieceNumber(currentPieceNumber + 1);
      } else setPieceNumber(currentPieceNumber);
    });

    return updatedLogs;
  };

  // Handle form submission.
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  // Handle end of task.
  const handleEndTask = () => {
    window.location.reload();
  };

  // Handle deletion of a log entry.
  const handleDeleteLog = (logId) => {
    // Finding the log using the logs unique id.
    const logToDelete = inspectionLogs.find((log) => log._id === logId);

    if (logToDelete) {
      // Displaying logs without the deleted log.
      const updatedLogs = inspectionLogs.filter((log) => log._id !== logId);

      // Re-index piece numbers
      const reIndexedLogs = reIndexPieceNumbers(updatedLogs);

      setInspectionLogs(reIndexedLogs);
      localStorage.setItem("inspectionLogs", JSON.stringify(reIndexedLogs));

      // Updating statistics for deletion.
      handleUpdatedWorkOrderStatsForDeletion(logToDelete);
      if (logToDelete.status === "Accepted") {
        setAcceptedCount(acceptedCount - 1);
        setInspectedCount(inspectedCount - 1);
      } else if (
        // If the log was a continuation log, then don't update the stats.
        logToDelete.status === "Rejected" &&
        inspectionLogs.filter(
          (log) =>
            logToDelete.pieceNumber === log.pieceNumber &&
            log.status === "Rejected"
        ).length === 1
      ) {
        setRejectedCount(rejectedCount - 1);
        setInspectedCount(inspectedCount - 1);
      }
      // If the log is a rejection, then update the "rejections" section of the stats.
      const newRejectionStats = { ...rejectionStats };
      if (
        newRejectionStats[logToDelete.category] &&
        newRejectionStats[logToDelete.category][logToDelete.details]
      ) {
        newRejectionStats[logToDelete.category][logToDelete.details]--;
        if (
          newRejectionStats[logToDelete.category][logToDelete.details] === 0
        ) {
          delete newRejectionStats[logToDelete.category][logToDelete.details];
          if (
            Object.keys(newRejectionStats[logToDelete.category]).length === 0
          ) {
            delete newRejectionStats[logToDelete.category];
          }
        }
      }
      setRejectionStats(newRejectionStats);
    }
    setIsContinuation(false);
  };

  // Function to update the Work Order specific stats when a log it deleted.
  const handleUpdatedWorkOrderStatsForDeletion = (logToDelete) => {
    const updatedWorkOrders = [...listOfWorkOrders];
    const updateStats = updatedWorkOrders.find(
      (workOrder) => workOrder.workOrderNumber === logToDelete.workOrderNumber
    );

    if (updateStats) {
      if (logToDelete.status === "Accepted") {
        updateStats.totalAccepted--;
        updateStats.totalInspected--;
      } else if (
        logToDelete.status === "Rejected" &&
        inspectionLogs.filter(
          (log) =>
            log.pieceNumber === logToDelete.pieceNumber &&
            log.status === "Rejected"
        ).length === 1
      ) {
        updateStats.totalRejected--;
        updateStats.totalInspected--;
      }

      // If there are no more logs for that WorkOrder, delete it.
      if (updateStats.totalInspected === 0) {
        const newWorkOrders = updatedWorkOrders.filter(
          (workOrder) =>
            workOrder.workOrderNumber !== logToDelete.workOrderNumber
        );
        setListOfWorkOrders(newWorkOrders);
      } else {
        setListOfWorkOrders(updatedWorkOrders);
      }
    }
  };

  // Handling the submission of the log to stop all prompts from popping up.
  const handleSubmitLogs = () => {
    setShowSubmitLogConfirmation(true);
    setShowApprovalConfirmation(false);
    setShowRejectionOptions(false);
    setShowRejectionConfirmation(false);
    setShowContinueRejectionPrompt(false);
  };

  // Handling the submission of logs to the server.
  const handleConfirmSubmitLogs = (onConfirm) => {
    if (onConfirm) {
      if (logsSubmitted === true) {
        return alert("Log Already Submitted.");
      }

      const rows = inspectionLogs.map((log) => ({
        workOrderNumber: log.workOrderNumber,
        industry: log.industry,
        productNumber: log.productNumber,
        inspectorName: log.inspectorName,
        inspectorEmployeeNumber: log.inspectorEmployeeNumber,
        status: log.status,
        category: log.category,
        details: log.details,
        employeeNumber: log.employeeNumber,
      }));

      // Displaying prompt to let user know the log is being processed
      setIsSubmitting(true);

      try {
        // Create a new workbook and add the logs as a sheet
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inspection Logs");

        // Generate and download the Excel file
        XLSX.writeFile(workbook, "inspection_logs.xlsx");

        // Update state and local storage
        setIsSubmitting(false);
        setLogsSubmitted(true);
        localStorage.removeItem("inspectionLogs");
      } catch (error) {
        console.error("Error creating Excel file:", error);
        setIsSubmitting(false);
      }
    }
    setShowSubmitLogConfirmation(false);
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowAdminPrompt(true);
      setShowApprovalConfirmation(false);
      setShowRejectionOptions(false);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === "1234") {
      setIsAdmin(true);
      setShowAdminPrompt(false);
      setPassword("");
    } else {
      alert("Incorrect password!");
    }
  };

  const handleCancelSubmit = () => {
    setShowAdminPrompt(false);
  };

  // Inside your Home component's return statement
  return (
    <div className="App">
      <h1>Quality Assurance Application</h1>
      <button
        className="instructions-button"
        onClick={() => setShowInstructions(true)}
      >
        Instructions
      </button>
      <InstructionsModal
        show={showInstructions}
        handleClose={() => setShowInstructions(false)}
      />
      {logsSubmitted && <div className="overlay" onClick={handleEndTask} />}
      {!formSubmitted ? (
        <InitialForm
          workOrderNumber={workOrderNumber}
          setWorkOrderNumber={setWorkOrderNumber}
          industry={industry}
          setIndustry={setIndustry}
          productNumber={productNumber}
          setProductNumber={setProductNumber}
          inspectorName={inspectorName}
          setInspectorName={setInspectorName}
          inspectorEmployeeNumber={inspectorEmployeeNumber}
          setInspectorEmployeeNumber={setInspectorEmployeeNumber}
          handleFormSubmit={handleFormSubmit}
        />
      ) : (
        <>
          <div className="button-container">
            <button className="admin-button" onClick={handleAdminClick}>
              {isAdmin ? "Logout" : "Admin"}
            </button>
            <button
              className="save-logs-button"
              onClick={saveLogsToLocalStorageButton}
            >
              Save Logs
            </button>
            <button
              className="back-button"
              onClick={() => setFormSubmitted(false)}
            >
              Back to Form
            </button>
            <button className="end-task-button" onClick={handleEndTask}>
              End Task
            </button>
          </div>
          <div>
            {showAdminPrompt && (
              <div className="password-prompt">
                <div className="password-prompt-content">
                  <h4>Enter the password for admin access</h4>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="submit-button"
                    onClick={handlePasswordSubmit}
                    onConfirm={true}
                  >
                    Submit
                  </button>
                  <button
                    className="cancel-button"
                    onClick={handleCancelSubmit}
                    onConfirm={false}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {isAdmin && <RejectionOptionsAdmin />}
          </div>
          <InspectionPage
            onApprove={handleApproval}
            onReject={handleRejection}
          />
          {showApprovalConfirmation && (
            <ApprovalConfirmation onConfirm={handleApprovalConfirmation} />
          )}
          {showRejectionOptions && (
            <RejectionOptions onSelect={handleRejectionSelection} />
          )}
          {showRejectionConfirmation && (
            <RejectionConfirmation
              rejectionDetails={`${selectedRejectionCategory} - ${selectedRejectionDetails}: By Employee ${employeeNumber}`}
              onConfirm={handleRejectionConfirmation}
            />
          )}
          {showContinueRejectionPrompt && (
            <ContinueRejectionPrompt onConfirm={handleContinueRejection} />
          )}
          {logsSubmitted && (
            <div className="logs-submitted-prompt">
              <p>Logs have been successfully submitted!</p>
              <button onClick={handleEndTask}>Start A New Log</button>
            </div>
          )}
          {isSubmitting && (
            <div className="submitting-message">
              Submitting logs, please wait...
            </div>
          )}
          {showSubmitLogConfirmation && (
            <SubmitLogConfirmation onConfirm={handleConfirmSubmitLogs} />
          )}
          <div className="main-container">
            <div className="stats">
              <Stats
                inspectedCount={inspectedCount}
                acceptedCount={acceptedCount}
                rejectedCount={rejectedCount}
                listOfWorkOrders={listOfWorkOrders}
                rejectionStats={rejectionStats}
              />
            </div>
            <Logs
              inspectionLogs={inspectionLogs}
              handleSubmitLogs={handleSubmitLogs}
              handleDeleteLog={handleDeleteLog}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
