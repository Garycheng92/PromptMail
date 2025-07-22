// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

import Home from './pages/Home';
import Citations from './pages/Citations';
import SingleEmail from './pages/SingleEmail';
import MultiEmail from './pages/MultiEmail';
import ContactUs from './pages/ContactUs';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// two logo imports
import logoLight from './assets/PromptMail_Logo.png';
import logoDark  from './assets/PromptMail_Logo_Darkmode2.png';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle the <body>.dark-mode class
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className="container-fluid px-0">
        {/* Logo Banner */}
        <div className="text-center py-3 bg-primary">
          <Link to="/">
            <img
              src={darkMode ? logoDark : logoLight}
              alt="PromptMail Logo"
              style={{
                height: '180px',
                border: '2px solid black',
                borderRadius: '8px'
              }}
            />
          </Link>
        </div>

        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
          <div className="container-fluid justify-content-center">
            <ul className="navbar-nav d-flex flex-row gap-4 align-items-center">
              <li className="nav-item">
                <Link to="/" className="nav-link text-white fs-5">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/citations" className="nav-link text-white fs-5">Citations</Link>
              </li>
              <li className="nav-item">
                <Link to="/single-email" className="nav-link text-white fs-5">Single Email</Link>
              </li>
              <li className="nav-item">
                <Link to="/multi-email" className="nav-link text-white fs-5">Multi-Email</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link text-white fs-5">Contact Us</Link>
              </li>

              {/* Gear Dropdown for Theme */}
              <li className="nav-item">
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="link"
                    className="nav-link text-white fs-5 p-0"
                    id="theme-dropdown"
                    title="Settings"
                  >
                    ⚙️
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      active={!darkMode}
                      onClick={() => setDarkMode(false)}
                    >
                      Light Mode
                    </Dropdown.Item>
                    <Dropdown.Item
                      active={darkMode}
                      onClick={() => setDarkMode(true)}
                    >
                      Dark Mode
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul>
          </div>
        </nav>

        {/* Page Content */}
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/citations" element={<Citations />} />
            <Route path="/single-email" element={<SingleEmail />} />
            <Route path="/multi-email" element={<MultiEmail />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
