import React from 'react';
import { render, screen } from '@testing-library/react';
import Calculations from './Calculations';

test('renders learn react link', () => {
  render(<Calculations />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
