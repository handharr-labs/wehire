import { Metadata } from 'next';
import { MarketingLandingView } from '@/features/marketing-landing/presentation/MarketingLandingView';

export const metadata: Metadata = {
  title: 'WeHire — Branded Career Pages for Small Businesses',
  description: 'Launch your own recruitment microsite in minutes. No code needed.',
};

export default function HomePage() {
  return <MarketingLandingView />;
}
