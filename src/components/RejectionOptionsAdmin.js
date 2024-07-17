import React, { useState, useEffect, useMemo } from "react";
import "./styles/RejectionOptionsAdmin.css";

const RejectionOptionsAdmin = () => {
  const [options, setOptions] = useState({});
  const [tempOptions, setTempOptions] = useState({});
  const [newCategory, setNewCategory] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
    const savedOptions = localStorage.getItem("rejectionOptions");
    if (savedOptions) {
      const parsedOptions = JSON.parse(savedOptions);
      setOptions(parsedOptions);
      setTempOptions(parsedOptions);
    } else {
      setOptions(defaultOptions);
      setTempOptions(defaultOptions);
    }
  }, [defaultOptions]);
  const saveOptions = (newOptions) => {
    localStorage.setItem("rejectionOptions", JSON.stringify(newOptions));
    setOptions(newOptions);
    setTempOptions(newOptions);
  };

  const handleAddCategory = () => {
    if (newCategory && !tempOptions[newCategory]) {
      const newTempOptions = { ...tempOptions, [newCategory]: [] };
      setTempOptions(newTempOptions);
      setNewCategory("");
    }
  };

  const handleAddDetail = () => {
    if (selectedCategory && newDetail) {
      const newTempOptions = {
        ...tempOptions,
        [selectedCategory]: [
          ...(tempOptions[selectedCategory] || []),
          newDetail,
        ],
      };
      setTempOptions(newTempOptions);
      setNewDetail("");
    }
  };

  const handleRemoveCategory = (category) => {
    const { [category]: _, ...newTempOptions } = tempOptions;
    setTempOptions(newTempOptions);
  };

  const handleRemoveDetail = (category, detail) => {
    const newTempOptions = {
      ...tempOptions,
      [category]: tempOptions[category].filter((d) => d !== detail),
    };
    setTempOptions(newTempOptions);
  };

  const handleSaveChanges = () => {
    saveOptions(tempOptions);
    alert("Changes Saved!");
  };

  const handleDiscardChanges = () => {
    setTempOptions(options);
    alert("Changes Discarded!");
  };

  const handleResetToDefault = () => {
    saveOptions(defaultOptions);
    alert("Changes Reset!");
  };

  return (
    <div className="admin-panel">
      <h3 className="admin-panel-title">Admin Panel</h3>

      <div className="add-category-section">
        <h4>Add Category</h4>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="category-input"
        />
        <button onClick={handleAddCategory} className="add-category-button">
          Add Category
        </button>
      </div>

      <div className="add-detail-section">
        <h4>Add Detail</h4>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">Select Category</option>
          {Object.keys(tempOptions).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newDetail}
          onChange={(e) => setNewDetail(e.target.value)}
          className="detail-input"
        />
        <button onClick={handleAddDetail} className="add-detail-button">
          Add Detail
        </button>
      </div>

      <div className="edit-options-section">
        <h4>Edit Rejection Options</h4>
        {Object.keys(tempOptions).map((category) => (
          <div key={category} className="category-section">
            <h5 className="category-title">
              {category}
              <button
                onClick={() => handleRemoveCategory(category)}
                className="remove-category-button"
              >
                Remove Category
              </button>
            </h5>
            <ul className="details-list">
              {Array.isArray(tempOptions[category]) &&
                tempOptions[category].map((detail) => (
                  <li key={detail} className="detail-item">
                    {detail}
                    <button
                      onClick={() => handleRemoveDetail(category, detail)}
                      className="remove-detail-button"
                    >
                      Remove Detail
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="panel-buttons">
        <button className="panel-button" onClick={handleSaveChanges}>
          Save Changes
        </button>
        <button className="panel-button" onClick={handleDiscardChanges}>
          Discard Changes
        </button>
        <button className="panel-button" onClick={handleResetToDefault}>
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default RejectionOptionsAdmin;
