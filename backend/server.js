require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const smartsheet = require("smartsheet");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = smartsheet.createClient({
  accessToken: process.env.SMARTSHEET_API_TOKEN,
  logLevel: "info",
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Define a schema for your logs
const logSchema = new mongoose.Schema({
  workOrderNumber: String,
  industry: String,
  productNumber: String,
  inspectorName: String,
  inspectorEmployeeNumber: String,
  time: Date,
  category: String,
  details: String,
  employeeNumber: String,
  status: String,
});

// Create a model for your logs
const Log = mongoose.model("Log", logSchema);

app.post("/submit-logs", async (req, res) => {
  const { rows } = req.body;

  if (!rows || !Array.isArray(rows)) {
    return res.status(400).json({ error: "Invalid rows data" });
  }

  const formattedRows = rows.map((row) => ({
    cells: row.cells.map((cell) => ({
      columnId: Number(cell.columnId),
      value: cell.value.toString(),
    })),
  }));

  try {
    const sheetId = process.env.SMARTSHEET_SHEET_ID;
    if (!sheetId) {
      throw new Error(
        "SMARTSHEET_SHEET_ID is not defined in the environment variables"
      );
    }

    // Add rows to the sheet
    const response = await client.sheets.addRows({
      sheetId: sheetId,
      body: formattedRows,
    });

    // Save logs to MongoDB
    const logEntries = rows.map((row) => {
      let logEntry = {};
      row.cells.forEach((cell) => {
        switch (cell.columnId) {
          case "7941797889396612":
            logEntry.workOrderNumber = cell.value;
            break;
          case "7378847935975300":
            logEntry.industry = cell.value;
            break;
          case "1749348401762180":
            logEntry.productNumber = cell.value;
            break;
          case "3018342609932164":
            logEntry.inspectorName = cell.value;
            break;
          case "7521942237302660":
            logEntry.inspectorEmployeeNumber = cell.value;
            break;
          // case "2875248308604804":
          //   logEntry.time = new Date(cell.value);
          //   break;
          case "623448494919556":
            logEntry.category = cell.value;
            break;
          case "5127048122290052":
            logEntry.details = cell.value;
            break;
          case "1892442703089540":
            logEntry.employeeNumber = cell.value;
            break;
        }
      });
      logEntry.status = "Rejected";
      return logEntry;
    });

    await Log.insertMany(logEntries);

    res.json(response);
  } catch (error) {
    if (error.response) {
      console.error("Smartsheet API response error:", error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error("No response received from Smartsheet API:", error.request);
      res
        .status(500)
        .json({ error: "No response received from Smartsheet API" });
    } else {
      console.error(
        "Error in setting up request to Smartsheet API:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
