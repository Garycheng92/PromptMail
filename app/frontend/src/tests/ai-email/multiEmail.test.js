import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import assert from 'assert';
import 'jsdom-global/register';
import MultiEmail from '../../pages/MultiEmail.jsx';

console.log('Running MultiEmail test');

// Helper function for getting all by data-testid prefix
function getAllByTestIdPrefix(prefix) {
  return Array.from(document.querySelectorAll('[data-testid]')).filter(element =>
    element.dataset.testid.startsWith(prefix)
  );
}

// Helper function for getting single data-testid by prefix
function getByTestIdPrefix(prefix) {
  return getAllByTestIdPrefix(prefix)[0];
}

describe('<MultiEmail />', () => {
  beforeEach(() => {
    render(<MultiEmail />);
  });

  it('Initial email block', () => {
    const emailBlocks = getAllByTestIdPrefix('email-block-');
    assert.strictEqual(emailBlocks.length, 1);
  });

  it('Typing in first email', () => {
    const textareaInput = getByTestIdPrefix('email-input-');
    fireEvent.change(textareaInput, { target: { value: 'Test multi-email input' } });
    assert.strictEqual(textareaInput.value, 'Test multi-email input');
  });

  it('Add email functionality', () => {
    const addButton = screen.getByTestId('add-email-button');
    fireEvent.click(addButton);

    const emailBlocks = getAllByTestIdPrefix('email-block-');
    assert.strictEqual(emailBlocks.length, 2);
  });

  it('Clear functionality', () => {
    const textareaInput = getByTestIdPrefix('email-input-');
    const clearButton = getByTestIdPrefix('clear-button-');

    fireEvent.change(textareaInput, { target: { value: 'Will be cleared' } });
    fireEvent.click(clearButton);
    assert.strictEqual(textareaInput.value, '');
  });

  it('Delete functionality', () => {
    // Add block
    const addButton = screen.getByTestId('add-email-button');
    fireEvent.click(addButton);

    // Select second block
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); 

    // Delete selected block
    const deleteButton = screen.getByTestId('delete-selected-button');
    fireEvent.click(deleteButton);

    const emailBlocks = getAllByTestIdPrefix('email-block-');
    assert.strictEqual(emailBlocks.length, 1);
  });

  it('Tone generation populates', () => {
    const generateButton = getByTestIdPrefix('generate-button-');
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
      const tab = getByTestIdPrefix(`tab-${tone}-`);
      fireEvent.click(tab);
      const response = getByTestIdPrefix(`response-${tone}-`);
      assert.ok(response.value.length > 0, `${tone} response is empty`);
    }
  });
});