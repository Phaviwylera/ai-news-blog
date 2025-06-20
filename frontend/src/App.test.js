import { render, screen } from '@testing-library/react';
import App from './App';

test('renders blog heading', () => {
  render(<App />);
  const heading = screen.getByText(/The AI Times/i);
  expect(heading).toBeInTheDocument();
});
