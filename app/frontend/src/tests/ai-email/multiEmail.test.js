import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import assert from 'assert';
import 'jsdom-global/register';
import MultiEmail from '../../pages/MultiEmail.jsx';

console.log('Running MultiEmail test');

describe('<MultiEmail />', () => {
  beforeEach(() => {
    render(<MultiEmail />);
  });

  it('Initial email block', () => {
    const headers = screen.getAllByText(/Email Section/i);
    assert.strictEqual(headers.length, 1);
  });

  it('Typing in first email', () => {
    const textarea = screen.getByPlaceholderText('Paste your email here...');
    fireEvent.change(textarea, { target: { value: 'Test multi-email input' } });
    assert.strictEqual(textarea.value, 'Test multi-email input');
  });

  it('Add email functionality', () => {
    const addButton = screen.getByText('+ Add Email');
    fireEvent.click(addButton);
    const headers = screen.getAllByText(/Email Section/i);
    assert.strictEqual(headers.length, 2);
  });

  it('Clear button', () => {
    const textarea = screen.getByPlaceholderText('Paste your email here...');
    fireEvent.change(textarea, { target: { value: 'Will be cleared' } });

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);
    assert.strictEqual(textarea.value, '');
  });

  it('Tone generation', () => {
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);

    const summaryTextarea = screen.getByLabelText('Summary', { selector: 'textarea' });
    assert.ok(summaryTextarea.value.includes('Thou art invited'));
  });

  it('Delete functionality', () => {
    // Add block
    const addButton = screen.getByText('+ Add Email');
    fireEvent.click(addButton);

    // Select second block
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); 

    // Delete selected block
    const deleteButton = screen.getByText('🗑️ Delete Selected');
    fireEvent.click(deleteButton);

    const headers = screen.getAllByText(/Email Section/i);
    assert.strictEqual(headers.length, 1);
  });
});