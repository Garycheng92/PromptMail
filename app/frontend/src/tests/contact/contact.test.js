import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import assert from 'assert';
import 'jsdom-global/register';
import ContactUs from '../../pages/ContactUs.jsx';

describe('<ContactUs />', () => {
  it('Alert on submission', () => {
    let alertMessage = null;
    global.alert = (msg) => {
      alertMessage = msg;
    };

    render(<ContactUs />);

    fireEvent.change(screen.getByLabelText('Your Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Your Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Test message' },
    });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    // ✅ Now this works
    assert.strictEqual(alertMessage, 'Your message has been submitted!');
  });
});
