import React from 'react';
import './Citations.css';

function Citations() {
  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold mb-2 text-primary">Citations & Acknowledgments</h1>
        <p className="lead mb-4 text-primary fw-bold">
          This page lists the core technologies and services powering PromptMail.
        </p>
      </div>

      {/* Citation List with Styling */}
      <div className="citations-section">
        <ul className="list-group">
          <li className="list-group-item">
            <strong>OpenAI (GPT API)</strong><br />
            This application uses OpenAI’s GPT API for language understanding and response generation.<br />
            <a href="https://openai.com/api" target="_blank" rel="noopener noreferrer">
              https://openai.com/api
            </a>
          </li>
          <li className="list-group-item">
            <strong>Docker</strong><br />
            Docker is used to containerize and manage both the frontend and backend environments.<br />
            <a href="https://www.docker.com" target="_blank" rel="noopener noreferrer">
              https://www.docker.com
            </a>
          </li>
          <li className="list-group-item">
            <strong>React</strong><br />
            The frontend is built using React, a JavaScript library for building user interfaces.<br />
            <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
              https://reactjs.org
            </a>
          </li>
          <li className="list-group-item">
            <strong>Node.js</strong><br />
            The backend logic is implemented using Node.js, a JavaScript runtime built on Chrome's V8 engine.<br />
            <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">
              https://nodejs.org
            </a>
          </li>
          <li className="list-group-item">
            <strong>Bootstrap</strong><br />
            Bootstrap provides responsive design and prebuilt styles used throughout the frontend.<br />
            <a href="https://getbootstrap.com" target="_blank" rel="noopener noreferrer">
              https://getbootstrap.com
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Citations;
