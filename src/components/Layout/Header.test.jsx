import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the header with the correct title and tagline', () => {
    render(<Header />);
    
    const titleElement = screen.getByText('DeskGif');
    const taglineElement = screen.getByText('Local gif manipulation');
    
    expect(titleElement).toBeInTheDocument();
    expect(taglineElement).toBeInTheDocument();
  });
});
