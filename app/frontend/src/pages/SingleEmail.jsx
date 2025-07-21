import React, { useState } from 'react';
import { Tabs, Tab, Card } from 'react-bootstrap';
import './SingleEmail.css';

function SingleEmail() {
  const [emailText, setEmailText] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const [responses, setResponses] = useState({
    summary: '',
    formal: '',
    casual: '',
    satirical: '',
    funny: '',
    oldEnglish: '',
    teenspeak: '',
  });

  const handleGenerate = async () => {
    setResponses({
      summary: '• Thou art invited\n• Attend at sundown\n• Bring forth merriment',
      formal: 'Dear Sir/Madam, Thank you for your message...',
      casual: 'Hey! Got your email. Sounds good...',
      satirical: 'Oh wow, what a *groundbreaking* email...',
      funny: 'Roses are red, emails are blue, here’s my response, just for you!',
      oldEnglish: 'Hark! Thy words hath reached mine eyes and struck a chord in mine heart...',
      teenspeak: 'Yo that email had mad rizz fr 💯. LOL I’m vibing with it big time 🫡',
    });
  };

  const handleClear = () => {
    setEmailText('');
    setResponses({
      summary: '',
      formal: '',
      casual: '',
      satirical: '',
      funny: '',
      oldEnglish: '',
      teenspeak: '',
    });
  };

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold mb-2 text-primary">Single Email Function</h1>
        <p className="lead mb-4 text-primary fw-bold">
          Analyze one email and generate multiple types of responses using AI.
        </p>
      </div>

      {/* Section Box */}
      <div className="single-email-section">
        <div className="row">
          {/* Input Section */}
          <div className="col-md-6">
            <h5 className="mb-2">Input Email</h5>
            <textarea
              className="form-control"
              rows="10"
              placeholder="Paste your email here..."
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
            />
            <div className="mt-3 d-flex gap-3">
              <button className="btn btn-primary" onClick={handleGenerate}>Generate</button>
              <button className="btn btn-secondary" onClick={handleClear}>Clear</button>
            </div>
          </div>

          {/* Output Section */}
          <div className="col-md-6">
            <h5 className="mb-2">AI Response Output</h5>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3 custom-tabs"
              justify
            >
              {[
                ['summary', 'Summary'],
                ['formal', 'Formal'],
                ['casual', 'Casual'],
                ['satirical', 'Satirical'],
                ['funny', 'Funny'],
                ['oldEnglish', 'Old English'],
                ['teenspeak', 'Teens Speak'],
              ].map(([key, label]) => (
                <Tab key={key} eventKey={key} title={label}>
                  <Card className="p-3 output-box">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label htmlFor={`${key}Output`} className="fw-bold">{label}</label>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => navigator.clipboard.writeText(responses[key])}
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                    <textarea
                      id={`${key}Output`}
                      className="form-control"
                      rows="6"
                      style={{ whiteSpace: 'pre-wrap', overflowY: 'auto' }}
                      value={responses[key] || `${label} response will appear here after generation.`}
                      onChange={(e) =>
                        setResponses({ ...responses, [key]: e.target.value })
                      }
                    />
                  </Card>
                </Tab>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleEmail;
