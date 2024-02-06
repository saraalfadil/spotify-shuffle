import { render, screen } from '@testing-library/react';
import App from './App';

test('renders paragraph', () => {
  render(<App />);
  const pElement = screen.getByText(/spotify shuffle app/i);
  expect(pElement).toBeInTheDocument();
});
