import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Duplicate', () => {
  const { getByText } = render(<App />);
  const title = getByText(/Duplicate/i);
  expect(title).toBeInTheDocument();
});
