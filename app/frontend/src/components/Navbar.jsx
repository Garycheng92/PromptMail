import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { ThemeContext } from '../ThemeContext';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Gear } from 'react-bootstrap-icons';
import logo from '../assets/PromptMail_Logo.png';

function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="PromptMail"
            height="40"
            className="me-2 border border-1 border-dark rounded"
          />
          PromptMail
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {[
              ['/', 'Home'],
              ['/citations', 'Citations'],
              ['/single-email', 'Single Email'],
              ['/multi-email', 'Multi‑Email'],
              ['/contact', 'Contact Us'],
            ].map(([path, label]) => (
              <li className="nav-item" key={path}>
                <Link to={path} className="nav-link fs-5">
                  {label}
                </Link>
              </li>
            ))}

            {/* Settings Gear */}
            <li className="nav-item dropdown">
              <OverlayTrigger placement="bottom" overlay={<Tooltip>Settings</Tooltip>}>
                <button
                  className="btn btn-link nav-link p-0"
                  onClick={() => setShowDropdown(s => !s)}
                >
                  <Gear size={20} />
                </button>
              </OverlayTrigger>

              {showDropdown && (
                <ul className="dropdown-menu dropdown-menu-end show">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setDarkMode(!darkMode);
                        setShowDropdown(false);
                      }}
                    >
                      {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
