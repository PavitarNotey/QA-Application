import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <a
        href="https://www.linkedin.com/company/fellfab-/?originalSubdomain=ca"
        className="footer-option"
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
      <a
        href="https://www.fellfab.com/"
        className="footer-option"
        target="_blank"
        rel="noopener noreferrer"
      >
        Website
      </a>
      <a
        href="mailto:info@fellfab.com"
        className="footer-option"
        target="_blank"
        rel="noopener noreferrer"
      >
        Email Us
      </a>
    </footer>
  );
}

export default Footer;
