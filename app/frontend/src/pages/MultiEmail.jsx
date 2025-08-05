// src/pages/MultiEmail.jsx
import React, { useState } from 'react';
// ← ADDED: axios import for HTTP calls
import axios from 'axios';
import { Tabs, Tab, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';

import './MultiEmail.css';

// ← ADDED: base URL for your backend; falls back to localhost in dev
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const TONES = ['summary','formal','casual','satirical','punny','oldEnglish','teenspeak'];

function MultiEmail() {
  const initialBlock = () => ({
    id: Date.now() + Math.random(),
    emailText: '',
    activeTab: 'summary',
    responses: { summary:'',formal:'',casual:'',satirical:'',punny:'',oldEnglish:'',teenspeak:'' },
    selected: false,
    // ← ADDED: loading flag to disable Generate button
    loading: false,
  });
  const [emailBlocks, setEmailBlocks] = useState([initialBlock()]);

  // unchanged:
  const handleAddBlock = () =>
    setEmailBlocks(b => [...b, initialBlock()]);

  const handleDeleteSelected = () =>
    setEmailBlocks(b => b.filter(x => !x.selected));

  const updateBlock = (id, upd) =>
    setEmailBlocks(b => b.map(x => x.id === id ? { ...x, ...upd } : x));

  // ← UPDATED: now async, uses axios to call backend endpoint
  const handleGenerate = async (id) => {
    updateBlock(id, { loading: true }); // ← ADDED
    try {
      // ← ADDED: call each tone endpoint in parallel
      const resp = await Promise.all(
        TONES.map(tone =>
          axios
            .post(`${API_BASE}/api/prompt`, { text: emailBlocks.find(b=>b.id===id).emailText, tone })
            .then(r => ({ tone, result: r.data.result }))
        )
      );
      const newResp = {};
      resp.forEach(({ tone, result }) => newResp[tone] = result);
      updateBlock(id, { responses: newResp });
    } catch (err) {
      console.error(err);
      // ← FALLBACK: placeholder responses on error
      updateBlock(id, {
        responses: {
          summary:'• A\n• B\n• C',
          formal:'Dear Sir/Madam,…',
          casual:'Hey there…',
          satirical:'Wow, so new…',
          punny:'Let me “pun” this email…',
          oldEnglish:'Hark! Thy email…',
          teenspeak:'Yo this was fire…',
        }
      });
      alert('Error generating responses — showing placeholders.');
    } finally {
      updateBlock(id, { loading: false }); // ← ADDED
    }
  };

  // unchanged:
  const handleClear = (id) =>
    updateBlock(id, {
      emailText:'',
      responses:{ summary:'',formal:'',casual:'',satirical:'',punny:'',oldEnglish:'',teenspeak:'' }
    });

  // unchanged:
  const handleSpeechToText = (id) => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('Speech Recognition unsupported');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SR();
    recog.lang = 'en-US';
    recog.start();
    recog.onresult = e =>
      updateBlock(id, { emailText: e.results[0][0].transcript });
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold mb-2 text-primary">Multi-Email Function</h1>
        <p className="lead mb-4 text-primary fw-bold">
          Analyze and respond to multiple emails in bulk.
        </p>
      </div>

      {/* Top Controls */}
      <div className="d-flex justify-content-end mb-3 gap-2">
        <OverlayTrigger overlay={<Tooltip>Add new email section</Tooltip>}>
          <button
            className="btn btn-success highlight-hover"
            onClick={handleAddBlock}
            data-testid="add-email-button"
          >+ Add Email</button>
        </OverlayTrigger>
        <OverlayTrigger overlay={<Tooltip>Delete selected sections</Tooltip>}>
          <button
            className="btn btn-danger highlight-hover"
            onClick={handleDeleteSelected}
            data-testid="delete-selected-button"
          >🗑️ Delete Selected</button>
        </OverlayTrigger>
      </div>

      {/* Blocks */}
      {emailBlocks.map((block,i)=>(
        <div key={block.id} className="email-section" data-testid={`email-block-${block.id}`}>
          {/* Section Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-primary fw-bold">Email Section {i+1}</h5>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`sel-${block.id}`}
                checked={block.selected}
                onChange={e=>updateBlock(block.id,{selected:e.target.checked})}
              />
              <label className="form-check-label" htmlFor={`sel-${block.id}`}>
                Select for Deletion
              </label>
            </div>
          </div>

          <div className="row">
            {/* Input */}
            <div className="col-md-6">
              <h5 className="mb-2">Input Email</h5>
              <div className="position-relative">
                <textarea
                  className="form-control"
                  rows="8"
                  maxLength={300}
                  placeholder="Paste your email here…"
                  value={block.emailText}
                  onChange={e=>updateBlock(block.id,{emailText:e.target.value})}
                  data-testid={`email-input-${block.id}`}
                />
                <OverlayTrigger overlay={<Tooltip>Voice → text</Tooltip>}>
                  <button
                    className="btn btn-sm btn-outline-secondary speech-btn"
                    onClick={()=>handleSpeechToText(block.id)}
                  >🎙️</button>
                </OverlayTrigger>
              </div>
              <div className="mt-3 d-flex gap-3">
                <OverlayTrigger overlay={<Tooltip>Generate AI responses</Tooltip>}>
                  <button
                    className="btn btn-primary highlight-hover"
                    onClick={()=>handleGenerate(block.id)}
                    // ← UPDATED: disable while loading
                    disabled={block.loading}
                    data-testid={`generate-button-${block.id}`}
                  >
                    {/* ← UPDATED: show spinner text */}
                    {block.loading ? 'Generating…' : 'Generate'}
                  </button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip>Clear this section</Tooltip>}>
                  <button
                    className="btn btn-secondary highlight-hover"
                    onClick={()=>handleClear(block.id)}
                    data-testid={`clear-button-${block.id}`}
                  >Clear</button>
                </OverlayTrigger>
              </div>
            </div>

            {/* Output */}
            <div className="col-md-6">
              <h5 className="mb-2">AI Response Output</h5>
              <Tabs
                activeKey={block.activeTab}
                onSelect={k=>updateBlock(block.id,{activeTab:k})}
                className="mb-3 custom-tabs"
                justify
              >
                {TONES.map(key=>{
                  const label = key==='punny'? 'Punny'
                               : key==='oldEnglish'? 'Old English'
                               : key==='teenspeak'? 'Teens Speak'
                               : key.charAt(0).toUpperCase()+key.slice(1);
                  return (
                    <Tab key={key} eventKey={key} title={label}>
                      <Card className="p-3 output-box">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label htmlFor={`${key}-${block.id}`} className="fw-bold">{label}</label>
                          <OverlayTrigger overlay={<Tooltip>Copy to clipboard</Tooltip>}>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={()=>navigator.clipboard.writeText(block.responses[key])}
                            >📋</button>
                          </OverlayTrigger>
                        </div>
                        <textarea
                          id={`${key}-${block.id}`}
                          className="form-control"
                          rows="5"
                          style={{whiteSpace:'pre-wrap',overflowY:'auto'}}
                          value={block.responses[key]||`${label} will appear here.`}
                          onChange={e=>updateBlock(block.id,{
                            responses:{...block.responses,[key]:e.target.value}
                          })}
                          data-testid={`response-${key}-${block.id}`}
                        />
                      </Card>
                    </Tab>
                  );
                })}
              </Tabs>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MultiEmail;
