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
    const textarea = screen.getByPlaceholderText('Paste your email here...');
    assert.ok(textarea);
  });

  // Typing input
  it('Typing allowed for email input textarea', () => {
    const textarea = screen.getByPlaceholderText('Paste your email here...');
    fireEvent.change(textarea, {target: {value: 'Test email typed'}});
    assert.strictEqual(textarea.value, 'Test email typed');
  });

  // 'Clear' button
  it('Clear button functionality when clicked', () => {
    const textarea = screen.getByPlaceholderText('Paste your email here...');
    const clearButton = screen.getByText('Clear');
    fireEvent.change(textarea, {target: {value: 'Filled text'}});
    fireEvent.click(clearButton);
    assert.strictEqual(textarea.value, '');
  });

  // Tone response
  it('All tone responses populated by "Generate" button', () => {
    const toneTabs = screen.getAllByRole('tab');
    assert.ok(toneTabs.length > 0, 'Could not fetch all tone tabs');

    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);
    for (const tab of toneTabs) {
      const label = tab.textContent;
      fireEvent.click(tab);
      const output = screen.getByLabelText(label, {selector: 'textarea'});
      assert.ok(output.value.length > 0, `Tab ${label} did not populate output`);
    }
  });
});