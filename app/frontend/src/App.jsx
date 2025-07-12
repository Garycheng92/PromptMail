import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Citations from './pages/Citations';
import SingleEmail from './pages/SingleEmail';
import MultiEmail from './pages/MultiEmail';
import ContactUs from './pages/ContactUs';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import logo from './assets/PromptMail_Logo.png';

function App() {
  return (
    <Router>
      <div className="container-fluid px-0">
        {/* Logo Banner */}
      <div className="text-center py-3">
        <img
          src={logo}
          alt="PromptMail Logo"
          style={{ height: '180px' }}
        />
      </div>


        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid justify-content-center">
            <ul className="navbar-nav d-flex flex-row gap-4">
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
