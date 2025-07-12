import { useState } from 'react';
import { Tabs, Tab, Card } from 'react-bootstrap';
import './MultiEmail.css';

function MultiEmail() {
  const initialBlock = () => ({
    id: Date.now() + Math.random(), // more unique than Date.now()
    emailText: '',
    activeTab: 'summary',
    responses: {
      summary: '',
      formal: '',
      casual: '',
      satirical: '',
      funny: '',
      oldEnglish: '',
      teenspeak: '',
    },
    selected: false,
  });

  const [emailBlocks, setEmailBlocks] = useState([initialBlock()]);

  const handleAddBlock = () => {
    setEmailBlocks([...emailBlocks, initialBlock()]);
  };

  const handleDeleteSelected = () => {
    setEmailBlocks(emailBlocks.filter((block) => !block.selected));
  };

  const updateBlock = (id, updates) => {
    setEmailBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      )
    );
  };

  const handleGenerate = (id) => {
    updateBlock(id, {
      responses: {
        summary: '• Thou art invited\n• Attend at sundown\n• Bring forth merriment',
        formal: 'Dear Sir/Madam, Thank you for your message...',
        casual: 'Hey! Got your email. Sounds good...',
        satirical: 'Oh wow, what a *groundbreaking* email...',
        funny: 'Roses are red, emails are blue, here’s my response, just for you!',
        oldEnglish: 'Hark! Thy words hath reached mine eyes and struck a chord in mine heart...',
        teenspeak: 'Yo that email had mad rizz fr 💯. LOL I’m vibing with it big time 🫡',
      },
    });
  };

  const handleClear = (id) => {
    updateBlock(id, {
      emailText: '',
      responses: {
        summary: '',
        formal: '',
        casual: '',
        satirical: '',
        funny: '',
        oldEnglish: '',
        teenspeak: '',
      },
    });
  };

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold mb-2 text-primary">Multi-Email Function</h1>
        <p className="lead mb-4 text-primary fw-bold">
          Analyze and respond to multiple emails in bulk.
        </p>
      </div>

      {/* Top Controls */}
      <div className="d-flex justify-content-end mb-3 gap-2">
        <button className="btn btn-success" onClick={handleAddBlock}>+ Add Email</button>
        <button className="btn btn-danger" onClick={handleDeleteSelected}>🗑️ Delete Selected</button>
      </div>

      {/* Email Blocks */}
      {emailBlocks.map((block, index) => (
        <div key={block.id} className="email-section">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-primary fw-bold">Email Section {index + 1}</h5>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`select-${block.id}`}
                checked={block.selected}
                onChange={(e) =>
                  updateBlock(block.id, { selected: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor={`select-${block.id}`}>
                Select for Deletion
              </label>
            </div>
          </div>

          <div className="row">
            {/* Input Area */}
            <div className="col-md-6">
              <h5 className="mb-2">Input Email</h5>
              <textarea
                className="form-control"
                rows="10"
                placeholder="Paste your email here..."
                value={block.emailText}
                onChange={(e) =>
                  updateBlock(block.id, { emailText: e.target.value })
                }
              />
              <div className="mt-3 d-flex gap-3">
                <button
                  className="btn btn-primary"
                  onClick={() => handleGenerate(block.id)}
                >
                  Generate
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleClear(block.id)}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Output Area */}
            <div className="col-md-6">
              <h5 className="mb-2">AI Response Output</h5>
              <Tabs
                activeKey={block.activeTab}
                onSelect={(k) => updateBlock(block.id, { activeTab: k })}
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
                        <label htmlFor={`${key}-${block.id}`} className="fw-bold">{label}</label>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            navigator.clipboard.writeText(block.responses[key])
                          }
                          title="Copy to clipboard"
                        >
                          📋
                        </button>
                      </div>
                      <textarea
                        id={`${key}-${block.id}`}
                        className="form-control"
                        rows="6"
                        style={{ whiteSpace: 'pre-wrap', overflowY: 'auto' }}
                        value={block.responses[key] || `${label} response will appear here after generation.`}
                        onChange={(e) =>
                          updateBlock(block.id, {
                            responses: {
                              ...block.responses,
                              [key]: e.target.value,
                            },
                          })
                        }
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
