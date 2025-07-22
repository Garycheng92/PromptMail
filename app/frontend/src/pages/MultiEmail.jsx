
import React, { useState } from 'react';
import { Tabs, Tab, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';

import './MultiEmail.css';

function MultiEmail() {
  const initialBlock = () => ({
    id: Date.now() + Math.random(),
    emailText: '',
    activeTab: 'summary',
    responses: {
      summary:'',formal:'',casual:'',satirical:'',punny:'',oldEnglish:'',teenspeak:''
    },
    selected: false,
  });
  const [emailBlocks, setEmailBlocks] = useState([initialBlock()]);

  const handleAddBlock = () =>
    setEmailBlocks(b => [...b, initialBlock()]);

  const handleDeleteSelected = () =>
    setEmailBlocks(b => b.filter(x => !x.selected));

  const updateBlock = (id,upd) =>
    setEmailBlocks(b => b.map(x=>x.id===id?{...x,...upd}:x));

  const handleGenerate = id =>
    updateBlock(id,{responses:{
      summary:'• A\n• B\n• C',
      formal:'Dear Sir/Madam,…',
      casual:'Hey there…',
      satirical:'Wow, so new…',
      punny:'Let me “pun” this email…',
      oldEnglish:'Hark! Thy email…',
      teenspeak:'Yo this was fire…',
    }});

  const handleClear = id =>
    updateBlock(id,{
      emailText:'',
      responses:{summary:'',formal:'',casual:'',satirical:'',punny:'',oldEnglish:'',teenspeak:''}
    });

  const handleSpeechToText = id => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('Speech Recognition unsupported');
      return;
    }
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    const recog = new SR();
    recog.lang = 'en-US'; recog.start();
    recog.onresult = e => updateBlock(id,{emailText:e.results[0][0].transcript});
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold mb-2 text-primary">Multi‑Email Function</h1>
        <p className="lead mb-4 text-primary fw-bold">
          Analyze and respond to multiple emails in bulk.
        </p>
      </div>

      {/* Top Controls */}
      <div className="d-flex justify-content-end mb-3 gap-2">
        <OverlayTrigger overlay={<Tooltip>Add new email section</Tooltip>}>
          <button className="btn btn-success highlight-hover" onClick={handleAddBlock}>
            + Add Email
          </button>
        </OverlayTrigger>
        <OverlayTrigger overlay={<Tooltip>Delete selected sections</Tooltip>}>
          <button className="btn btn-danger highlight-hover" onClick={handleDeleteSelected}>
            🗑️ Delete Selected
          </button>
        </OverlayTrigger>
      </div>

      {/* Blocks */}
      {emailBlocks.map((block,i)=>(
        <div key={block.id} className="email-section">
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
                />
                <OverlayTrigger overlay={<Tooltip>Voice → text</Tooltip>}>
                  <button
                    className="btn btn-sm btn-outline-secondary speech-btn"
                    onClick={()=>handleSpeechToText(block.id)}
                  >🎙️</button>
                </OverlayTrigger>
              </div>
              <div className="mt-3 d-flex gap-3">
                <OverlayTrigger overlay={<Tooltip>Generate AI responses</Tooltip>}>
                  <button className="btn btn-primary highlight-hover"
                    onClick={()=>handleGenerate(block.id)}
                  >Generate</button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip>Clear this section</Tooltip>}>
                  <button className="btn btn-secondary highlight-hover"
                    onClick={()=>handleClear(block.id)}
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
                className="mb-3"
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
                ].map(([key,label])=>(
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
                        value={block.responses[key] || `${label} will appear here.`}
                        onChange={e=>updateBlock(block.id,{
                          responses:{...block.responses,[key]:e.target.value}
                        })}
                      />
                    </Card>
                  </Tab>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MultiEmail;
