import { Analytics } from "@vercel/analytics/react"
import localFont from 'next/font/local';
import './globals.css';

export const metadata = {
  title: 'Fellow Meet',
  description: 'Find and Meet Our Fellow Members',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
