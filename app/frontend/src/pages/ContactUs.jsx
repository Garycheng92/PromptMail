import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './ContactUs.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [emailError, setEmailError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (name === 'email') {
      // clear error as user types
      setEmailError('');
    }
  };

  const validateEmail = (email) => {
    // simple regex: at least one character before @, domain, and TLD
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    alert('Your message has been submitted!');
    // TODO: Connect to backend API if needed
  };

  return (
    <div className="container col-md-8 col-lg-6 mt-4">
      {/* Page Header */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold mb-2 text-primary">Contact Us</h1>
        <p className="lead mb-4 text-primary fw-bold">
          Have questions or feedback? Reach out and we’ll get back to you.
        </p>
      </div>

      {/* Contact Form Section */}
      <div className="contact-section">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group mb-3">
            <label htmlFor="name" className="form-label">Your Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">Your Email</label>
            <input
              type="email"
              className={`form-control ${emailError ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            {emailError && (
              <div className="invalid-feedback">
                {emailError}
              </div>
            )}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              className="form-control"
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message here..."
              required
            ></textarea>
          </div>

          {/* Enhanced Send Message Button */}
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Send your message</Tooltip>}>
            <button type="submit" className="btn btn-primary w-100 highlight-hover">
              Send Message
            </button>
          </OverlayTrigger>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
