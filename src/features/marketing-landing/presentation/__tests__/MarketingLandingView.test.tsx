import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarketingLandingView } from '../MarketingLandingView';

describe('MarketingLandingView', () => {
  it('renders H1 headline containing "your brand"', () => {
    render(<MarketingLandingView />);
    expect(screen.getByRole('heading', { level: 1, name: /your brand/i })).toBeTruthy();
  });

  it('renders "Get Started" CTA link', () => {
    render(<MarketingLandingView />);
    const links = screen.getAllByRole('link', { name: /get started/i });
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders all three feature card titles', () => {
    render(<MarketingLandingView />);
    expect(screen.getByText('Your Own Branded Microsite')).toBeTruthy();
    expect(screen.getByText('Free to Start')).toBeTruthy();
    expect(screen.getByText('Up and Running in Minutes')).toBeTruthy();
  });

  it('renders bottom CTA heading and Request Access link', () => {
    render(<MarketingLandingView />);
    expect(screen.getByRole('heading', { level: 2, name: /ready to launch/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /request access/i })).toBeTruthy();
  });
});
