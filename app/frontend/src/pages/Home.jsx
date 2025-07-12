import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold mb-2 text-primary">Welcome to PromptMail</h1>
        <p className="lead mb-4 text-primary fw-bold">
          Your AI-powered assistant for analyzing and responding to emails.
        </p>
      </div>

      {/* Main Content Section */}
      <div className="home-section">
        <p>
          PromptMail is a web application designed to help users process, understand, and respond to emails using the power of AI. It provides fast and contextually appropriate responses in various tones and formats.
        </p>

        <h5 className="mt-4 text-primary fw-bold">Available Features:</h5>
        <ul>
          <li>
            <strong>Single Email:</strong> Paste a single email and generate responses in multiple tones—summary, formal, casual, satirical, funny, old English, and teen speak.
          </li>
          <li>
            <strong>Multi-Email:</strong> Add and process multiple emails at once. Each email gets its own response block with tabs for the same output types. Sections can be dynamically added or deleted.
          </li>
          <li>
            <strong>Citations:</strong> View a list of technologies and services used to power this application.
          </li>
          <li>
            <strong>Contact Us:</strong> Submit your name, email, and a message to get in touch with our team for support or feedback.
          </li>
        </ul>

        <p className="mt-4">
          This tool was built using modern web technologies including React, Bootstrap, and OpenAI’s GPT API, and is packaged with Docker for easy deployment.
        </p>
      </div>
    </div>
  );
}

export default Home;
