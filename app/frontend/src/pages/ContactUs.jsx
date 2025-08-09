import React, { useState } from 'react';
import axios from 'axios';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './ContactUs.css';

const API_BASE =
  import.meta.env?.VITE_API_BASE?.trim() || 'http://localhost:5000';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [emailError, setEmailError] = useState('');
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState('');
  const [sentOk, setSentOk] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (name === 'email') {
      setEmailError('');
    }
    setServerError('');
    setSentOk(false);
  };

  const validateEmail = (email) => {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    try {
      setSending(true);
      setServerError('');
      setSentOk(false);

      await axios.post(`${API_BASE}/api/contact`, {
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      setSentOk(true);
      // clear the form
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Failed to send. Please try again.';
      setServerError(msg);
    } finally {
      setSending(false);
    }
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
        {/* Status messages */}
        {sentOk && (
          <div className="alert alert-success" role="alert">
             Your message has been sent. We’ll be in touch!
          </div>
        )}
        {serverError && (
          <div className="alert alert-danger" role="alert">
             {serverError}
          </div>
        )}

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
              disabled={sending}
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
              disabled={sending}
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
              disabled={sending}
            ></textarea>
          </div>

          {/* Send Message Button */}
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Send your message</Tooltip>}>
            <button
              type="submit"
              className="btn btn-primary w-100 highlight-hover"
              disabled={sending}
            >
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </OverlayTrigger>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
