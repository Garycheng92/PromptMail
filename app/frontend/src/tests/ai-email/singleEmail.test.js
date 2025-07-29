import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import assert from 'assert';
import 'jsdom-global/register';
import SingleEmail from '../../pages/SingleEmail.jsx'; 

console.log("Running SingleEmail test");

describe('<SingleEmail />', () => {
  beforeEach(() => {
    render(<SingleEmail />);
  });

  // Input render
  it('Email input textarea rendered', () => {
    const textareaInput = screen.getByTestId('email-input');
    assert.ok(textareaInput);
  });

  // Typing input
  it('Typing allowed for email input textarea', () => {
    const textareaInput = screen.getByTestId('email-input');
    fireEvent.change(textareaInput, {target: {value: 'Test email typed'}});
    assert.strictEqual(textareaInput.value, 'Test email typed');
  });

  // 'Clear' button
  it('Clear button functionality when clicked', () => {
    const textareaInput = screen.getByTestId('email-input');
    const clearButton = screen.getByTestId('clear-button');
    fireEvent.change(textareaInput, {target: {value: 'Filled text'}});
    fireEvent.click(clearButton);
    assert.strictEqual(textareaInput.value, '');
  });

  // Tone response
  it('All tone responses populated by "Generate" button', () => {
    const generateButton = screen.getByTestId('generate-button');
    fireEvent.click(generateButton);
    const tones = [
      'summary',
      'formal',
      'casual',
      'satirical',
      'punny',
      'oldEnglish',
      'teenspeak'
    ];

    for (const tone of tones) {
      const toneTab = screen.getByTestId(`tab-${tone}`);
      fireEvent.click(toneTab);
      const response = screen.getByTestId(`response-${tone}`);
      assert.ok(response.value.length > 0, `Tab ${tone} did not populate output`);
    }
  });
});