import React, { useState, useEffect, useMemo } from "react";
import "./styles/RejectionOptions.css";

const RejectionOptions = ({ onSelect }) => {
  const [rejectionOptions, setRejectionOptions] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [otherDetail, setOtherDetail] = useState("");

  const defaultOptions = useMemo(
    () => ({
      Fastener: [
        "Ta/etc",
        "Missing",
        "Wrong Location",
        "Crooked",
        "Wrong Side",
        "Wrong Type",
      ],
      Strap: [
        "Wrong Length",
        "Wrong Orientation",
        "Wrong Loop",
        "Missing Box Stack",
        "Loose Box Stack",
        "Crocked",
      ],
      Stitching: [
        "Missing",
        "Loose",
        "Messy",
        "Top Stitching Missing",
        "Top Stitching Too Large",
        "Puckering",
        "Poor Bark Stitching",
        "Open Seams",
      ],
      Label: [
        "Missing",
        "Crooked",
        "Wrong Location",
        "Wrong P/N Label",
        "Wrong P/N Tag",
      ],
      Hardware: [
        "Snap/Washer",
        "Wrong Item Used",
        "Wrong Location",
        "Wrong Side",
        "Missing",
      ],
      Cleaning: [
        "Threads Not Trimmed",
        "Loose Threads",
        "Stains/Dirt",
        "Flaw in the Material",
      ],
      TieBack: [
        "Missing",
        "Wrong Location",
        "Not to Spec/Drawing",
        "Installed Wrong",
      ],
      Miscellaneous: ["Engineering Error", "Cutting Error"],

      "RF Welding": [
        "Loose Weld",
        "Loose Patch",
        "Missing Patch",
        "Missing Weld",
        "Missing Grommet",
      ],
      "Rail - Back": [
        "Ticking",
        "Pan Cleaning",
        "Improper Gluing",
        "Sewing",
        "Upholstery",
        "Missing Hardware",
      ],
      "Rail - Bottom": [
        "Ticking",
        "Pan Cleaning",
        "Improper Gluing",
        "Sewing",
        "Upholstery",
        "Missing Hardware",
      ],
      "Rail - Single Head Rest": [
        "Ticking",
        "Pan Cleaning",
        "Improper Gluing",
        "Sewing (Top Stitch)",
        "Upholstery",
        "Missing Part",
      ],
      "Rail - Double Head Rest": [
        "Ticking",
        "Pan Cleaning",
        "Improper Gluing",
        "Sewing (Top Stitch)",
        "Upholstery",
        "Missing Hardware",
      ],
      "Elevator Pads": ["Drawing", "Cutting", "Stitch", "Label"],
    }),
    []
  );

  useEffect(() => {
    const localStorageOptions = localStorage.getItem("RejectionOptions");
    if (!localStorageOptions) {
      localStorage.setItem("RejectionOptions", JSON.stringify(defaultOptions));
      setRejectionOptions(defaultOptions);
    } else {
      setRejectionOptions(JSON.parse(localStorageOptions));
    }
  }, [defaultOptions]);

  // Function to initialize the category selected
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedDetail("");
    setOtherDetail("");
  };

  // Function to initialize the detail selected
  const handleDetailChange = (e) => {
    setSelectedDetail(e.target.value);
  };

  // Function to initialize the details if "Other" is selected where user manually inputs detail
  const handleOtherDetailChange = (e) => {
    setOtherDetail(e.target.value);
  };

  // Function to initialize the employee number when entered
  const handleEmployeeNumberChange = (e) => {
    setEmployeeNumber(e.target.value);
  };

  // Function to handle the selected values and initialize them to the variables for logs
  const handleSelect = () => {
    if (selectedCategory && (selectedDetail || otherDetail) && employeeNumber) {
      const category = selectedCategory;
      const detail =
        selectedCategory === "Other" ? otherDetail : selectedDetail;

      onSelect(category, detail, employeeNumber);
    }
  };

  return (
    <div className="rejection-options">
      <select
        className="category-select"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="">Select Rejection Category</option>
        {Object.keys(rejectionOptions).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
        <option value="Other">Other</option>
      </select>

      {/* This is for when the category is not other, so only drop downs for details */}
      {selectedCategory && selectedCategory !== "Other" && (
        <select
          className="detail-select"
          value={selectedDetail}
          onChange={handleDetailChange}
        >
          <option value="">Select Rejection Detail</option>
          {rejectionOptions[selectedCategory].map((detail) => (
            <option key={detail} value={detail}>
              {detail}
            </option>
          ))}
        </select>
      )}

      {/* This is for when the category is other, so we have a text box */}
      {selectedCategory === "Other" && (
        <div>
          <input
            type="text"
            placeholder="Enter Rejection Detail"
            value={otherDetail}
            onChange={handleOtherDetailChange}
            required
          />
        </div>
      )}

      {/* This is a number nox to allow the user to add employee numbers */}
      {(selectedCategory && selectedDetail) || selectedCategory === "Other" ? (
        <div>
          <input
            type="number"
            placeholder="Employee Number"
            value={employeeNumber}
            onChange={handleEmployeeNumberChange}
            min="0"
            required
          />
        </div>
      ) : null}

      {/* This is for when Submit is clicked, so we call handleSelect to initialize variables for logs */}
      <button
        className="select-button"
        onClick={handleSelect}
        disabled={
          !selectedCategory ||
          (!selectedDetail && selectedCategory !== "Other") ||
          !employeeNumber ||
          (selectedCategory === "Other" && !otherDetail)
        }
      >
        Submit
      </button>
    </div>
  );
};

export default RejectionOptions;
