import React, { useState } from 'react';
import { Tabs, Tab, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './SingleEmail.css'; // contains our baby‑blue background + hover highlight

function SingleEmail() {
  const [emailText, setEmailText] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const [responses, setResponses] = useState({
    summary: '',
    formal: '',
    casual: '',
    satirical: '',
    punny: '',
    oldEnglish: '',
    teenspeak: '',
  });

  const handleGenerate = () => {
    // …existing placeholder logic…
    setResponses({
      summary: '• Point A\n• Point B\n• Point C',
      formal: 'Dear Sir/Madam,…',
      casual: 'Hey, got your email…',
      satirical: 'Wow, so cutting‑edge…',
      punny: 'This is how I “pun” your email…',
      oldEnglish: 'Hark! Thy email…',
      teenspeak: 'Yo, that was lit fr…',
    });
  };

  const handleClear = () => {
    setEmailText('');
    setResponses({
      summary: '',
      formal: '',
      casual: '',
      satirical: '',
      punny: '',
      oldEnglish: '',
      teenspeak: '',
    });
  };

  // voice‑to‑text helper
  const handleSpeechToText = (e) => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('Speech Recognition not supported');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SR();
    recog.lang = 'en-US';
    recog.start();
    recog.onresult = (evt) => {
      setEmailText(evt.results[0][0].transcript);
    };
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
            <div className="position-relative">
              <textarea
                className="form-control"
                rows="10"
                maxLength={300}
                placeholder="Paste your email here…"
                value={emailText}
                onChange={e => setEmailText(e.target.value)}
                data-testid="email-input"
              />
              <OverlayTrigger overlay={<Tooltip>Voice → text</Tooltip>}>
                <button
                  className="btn btn-sm btn-outline-secondary speech-btn"
                  onClick={handleSpeechToText}
                >
                  🎙️
                </button>
              </OverlayTrigger>
            </div>
            <div className="mt-3 d-flex gap-3">
              <OverlayTrigger overlay={<Tooltip>Generate AI responses</Tooltip>}>
                <button 
                  className="btn btn-primary highlight-hover" 
                  onClick={handleGenerate}
                  data-testid="generate-button"
                >
                  Generate
                </button>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip>Clear input & outputs</Tooltip>}>
                <button 
                  className="btn btn-secondary highlight-hover" 
                  onClick={handleClear}
                  data-testid="clear-button"
                >
                  Clear
                </button>
              </OverlayTrigger>
            </div>
          </div>

          {/* Output Section */}
          <div className="col-md-6">
            <h5 className="mb-2">AI Response Output</h5>
            <Tabs
              activeKey={activeTab}
              onSelect={k => setActiveTab(k)}
              className="mb-3 custom-tabs"
              justify
            >
              {[
                ['summary','Summary'],
                ['formal','Formal'],
                ['casual','Casual'],
                ['satirical','Satirical'],
                ['punny','Punny'],
                ['oldEnglish','Old English'],
                ['teenspeak','Teens Speak'],
              ].map(([key,label]) => (
                <Tab key={key} eventKey={key} title={label} data-testid={`tab-${key}`}>
                  <Card className="p-3 output-box">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label htmlFor={`${key}Output`} className="fw-bold">{label}</label>
                      <OverlayTrigger overlay={<Tooltip>Copy to clipboard</Tooltip>}>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => navigator.clipboard.writeText(responses[key])}
                          data-testid="copy-button"
                        >📋</button>
                      </OverlayTrigger>
                    </div>
                    <textarea
                      id={`${key}Output`}
                      className="form-control"
                      rows="6"
                      style={{ whiteSpace:'pre-wrap',overflowY:'auto' }}
                      value={responses[key] || `${label} will appear here.`}
                      onChange={e => setResponses(r => ({...r,[key]:e.target.value}))}
                      data-testid={`response-${key}`}
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
