import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';

// Mock the react-router-dom components
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ path, element }) => (
    <div data-testid={`route-${path}`}>
      {React.isValidElement(element) ? element : null}
    </div>
  ),
  Link: ({ to, children }) => <a href={to} data-testid={`link-${to}`}>{children}</a>,
}));

// Mock the components used in App.js
jest.mock('./components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('./components/Footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('./pages/Dashboard', () => () => <div data-testid="dashboard">Dashboard</div>);
jest.mock('./pages/SearchSimulation', () => () => <div data-testid="search-simulation">Search Simulation</div>);
jest.mock('./pages/GroupBySimulation', () => () => <div data-testid="groupby-simulation">GroupBy Simulation</div>);
jest.mock('./pages/JoinSimulation', () => () => <div data-testid="join-simulation">Join Simulation</div>);
jest.mock('./pages/ExperimentHistory', () => () => <div data-testid="experiment-history">Experiment History</div>);
jest.mock('./pages/About', () => () => <div data-testid="about">About</div>);

test('renders the App component with router setup', () => {
  render(<App />);
  
  // Check if the router components are rendered
  expect(screen.getByTestId('browser-router')).toBeInTheDocument();
  expect(screen.getByTestId('routes')).toBeInTheDocument();
  
  // Check if the main layout components are rendered
  expect(screen.getByTestId('navbar')).toBeInTheDocument();
  expect(screen.getByTestId('footer')).toBeInTheDocument();
  
  // Check if the routes are set up correctly
  expect(screen.getByTestId('route-/')).toBeInTheDocument();
  expect(screen.getByTestId('route-/search')).toBeInTheDocument();
  expect(screen.getByTestId('route-/groupby')).toBeInTheDocument();
  expect(screen.getByTestId('route-/join')).toBeInTheDocument();
  expect(screen.getByTestId('route-/history')).toBeInTheDocument();
  expect(screen.getByTestId('route-/about')).toBeInTheDocument();
});

test('renders the Dashboard component on the root route', () => {
  render(<App />);
  expect(screen.getByTestId('dashboard')).toBeInTheDocument();
});