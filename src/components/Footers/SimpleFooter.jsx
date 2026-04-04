import React from "react";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";

const SimpleFooter = () => (
  <footer className="portfolio-footer" aria-label="Site footer">
    <Container className="portfolio-shell-container">
      <div className="portfolio-footer-inner">
        <div className="portfolio-footer-brand">
          <p className="portfolio-footer-copy">
            <strong>SquarePad Portfolio Demo</strong>
            <span>
              Local-first social product showcase with live profile links, interactive groups, theme switching, and interview-ready UX.
            </span>
          </p>
        </div>
        <nav className="portfolio-footer-nav" aria-label="Footer navigation">
          <Link to="/demo/timeline" className="portfolio-footer-link">
            Timeline
          </Link>
          <Link to="/demo/profile" className="portfolio-footer-link">
            Profile
          </Link>
          <Link to="/demo/messages" className="portfolio-footer-link">
            Messages
          </Link>
          <Link to="/demo/groups" className="portfolio-footer-link">
            Groups
          </Link>
          <Link to="/demo/admin" className="portfolio-footer-link">
            Admin
          </Link>
        </nav>
      </div>
    </Container>
  </footer>
);

export default SimpleFooter;
