import { Link } from "react-router-dom";
import logo from './assets/PromptMail_Logo.png';

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img src={logo} alt="PromptMail Logo" height="40" className="me-2" />
            PromptMail
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/citations" className="nav-link">Citations</Link>
              </li>
              <li className="nav-item">
                <Link to="/single-email" className="nav-link">Single Email</Link>
              </li>
              <li className="nav-item">
                <Link to="/multi-email" className="nav-link">Multi-Email</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* your page content will render here via React Router */}
    </div>
  );
}

export default App;
