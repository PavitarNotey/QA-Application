import React, { useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
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
        <Navbar.Brand to="/" className="nav-options">
          QA Application
        </Navbar.Brand>
        <Nav className="me-auto"></Nav>
      </Container>
    </Navbar>
  );
}

export default FellFabNavbar;
