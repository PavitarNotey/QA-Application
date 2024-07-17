import React, { useState } from "react";
import "./styles/InstructionsModal.css";
import { translations } from "./languages/instructionLanguages";

const InstructionsModal = ({ show, handleClose }) => {
  // Setting the default language is English
  const [language, setLanguage] = useState("en");

  const handleChangeLanguage = (event) => {
    setLanguage(event.target.value);
  };

  if (!show) {
    return null;
  }

  const { instructions, steps, close } = translations[language];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{instructions}</h2>
        {steps.map((step, index) => (
          <p key={index}>{step}</p>
        ))}
        <button className="close-button" onClick={handleClose}>
          {close}
        </button>
        <div className="language-selector">
          <label htmlFor="language-select">Choose a language:</label>
          <select
            id="language-select"
            onChange={handleChangeLanguage}
            value={language}
          >
            {/* Languages for the instructions */}
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="pa">Punjabi</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="gu">Gujarati</option>
            <option value="ur">Urdu</option>
            <option value="zh">Mandarin</option>
            <option value="fa">Farsi</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;
