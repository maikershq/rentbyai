import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RentBy - AI Agent Resource Marketplace',
  description: 'Decentralized marketplace for AI agents to rent resources on Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
