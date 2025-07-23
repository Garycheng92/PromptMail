import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import assert from 'assert';
import 'jsdom-global/register';
import Navbar from '../../components/Navbar.jsx';
import { ThemeContext } from '../../ThemeContext.jsx';

// Setup for light/dark mode theme context rendering before each test
let setDarkModeCalls = [];

function renderWithThemeContext(darkMode = false) {
  setDarkModeCalls = [];
  render(
    <ThemeContext.Provider value = {{
      darkMode,
      setDarkMode: (val) => setDarkModeCalls.push(val)
    }}>
    <Navbar />
    </ThemeContext.Provider>
  );
}

console.log('Running Navbar tests');

describe('<Navbar />', () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    renderWithThemeContext();
  });

  it('Nav Links Rendered', () => {
    const navLinks = screen.getAllByRole('link', { name: /.*/i });
    const navLabels = navLinks.map(link => link.textContent)
    expect(navLabels).to.include.members([
      'Home',
      'Citations',
      'Single Email',
      'Multi-Email',
      'Contact Us'
    ]);
  });

  it('Logo Displayed', () => {
    const logo = screen.getByAltText('PromptMail');
    expect(logo).to.exist;
  });

  it('Settings Dropdown Toggle', () => {
    const settingsButton = screen.getByRole('button', { name: /settings/i});

    // Dropdown initially invisible
    expect(screen.queryByText(/Switch to/i)).to.be.null;  

    // Dropdown toggled on
    fireEvent.click(settingsButton);
    expect(screen.getByText(/Switch to/i)).to.exist;
    
    // Dropdown toggled off
    fireEvent.click(settingsButton);
    expect(screen.getByText(/Switch to/i)).to.be.null;
  });

  it('Dark Mode Toggle', () => {
    const settingsButton = screen.getByRole('button', { name: /settings/i});
    fireEvent.click(settingsButton);

    const toggleTheme = screen.getByText('Switch to Dark Mode');
    fireEvent.click(toggleTheme);

    expect(setDarkModeCalls.length).to.equal(1);
    expect(setDarkModeCalls[0]).to.be.true;
    expect(screen.queryByText(/Switch to/i)).to.be.null;
  });

  it('Show Settings Tooltip on Hover', async () => {
    const settingsButton = screen.getByRole('button', { name: /settings/i});
    fireEvent.mouseOver(settingsButton);

    const tooltip = await screen.findByText('Settings');
    expect(tooltip).to.exist;
  });
});