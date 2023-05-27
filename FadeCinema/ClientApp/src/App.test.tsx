import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

test('React Render Component Test', () => {
    render(<App />);
    const divElement = screen.getByText(/Test/i);
    expect(divElement).toBeInTheDocument();
});