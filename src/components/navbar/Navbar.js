import React, { useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";

function FellFabNavbar() {
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
    }
  }, []);

  return (
    <Navbar expand="lg" className="nav">
      <Container>
        <Navbar.Brand as={Link} to="/" className="nav-options">
          <img
            src="/Fellfab-Blue-Logo.png"
            alt="FELLFAB Trademark Logo"
            className="logo"
          />
        </Navbar.Brand>
        <Nav className="me-auto"></Nav>
      </Container>
    </Navbar>
  );
}

export default FellFabNavbar;
