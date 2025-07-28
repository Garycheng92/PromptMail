import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import assert from 'assert';
import 'jsdom-global/register';
import Navbar from '../../components/Navbar.jsx';
import { ThemeContext } from '../../ThemeContext.jsx';
import { BrowserRouter } from 'react-router-dom';

// Setup for light/dark mode theme context rendering before each test
let setDarkModeCalls = [];

function renderWithThemeContext(darkMode = false) {
  setDarkModeCalls = [];
  render(
    <BrowserRouter>
      <ThemeContext.Provider value = {{
        darkMode,
        setDarkMode: (val) => setDarkModeCalls.push(val)
      }}>
        <Navbar />
      </ThemeContext.Provider>
    </BrowserRouter>
  );
}

console.log('Running Navbar tests');

describe('<Navbar />', () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    renderWithThemeContext();
  });

  it('Nav Links Rendered', () => {
    const expectedLinkIds = [
      'navlink-home',
      'navlink-citations',
      'navlink-single-email',
      'navlink-multi‑email',
      'navlink-contact-us'
    ];
    expectedLinkIds.forEach(id => {
      expect(screen.getByTestId(id)).to.exist;
    });
  });

  it('Logo Displayed', () => {
    const logo = screen.getByTestId('img-logo');
    expect(logo).to.exist;
  });

  it('Settings Dropdown Toggle', () => {
    const settingsButton = screen.getByTestId('settings-button');

    // Dropdown initially invisible
    expect(screen.queryByTestId('theme-button')).to.be.null;  

    // Dropdown toggled on
    fireEvent.click(settingsButton);
    expect(screen.getByTestId('theme-button')).to.exist;
    
    // Dropdown toggled off
    fireEvent.click(settingsButton);
    expect(screen.queryByTestId('theme-button')).to.be.null;
  });

  it('Dark Mode Toggle', () => {
    const settingsButton = screen.getByTestId('settings-button');
    fireEvent.click(settingsButton);

    const toggleTheme = screen.getByTestId('theme-button');
    fireEvent.click(toggleTheme);

    expect(setDarkModeCalls.length).to.equal(1);
    expect(setDarkModeCalls[0]).to.be.true;
    expect(screen.queryByTestId('theme-button')).to.be.null;
  });

  it('Show Settings Tooltip on Hover', async () => {
    const settingsButton = screen.getByTestId('settings-button');
    fireEvent.mouseOver(settingsButton);

    const tooltip = await screen.findByText('Settings');
    expect(tooltip).to.exist;
  });
});