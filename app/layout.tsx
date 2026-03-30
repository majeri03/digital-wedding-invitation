import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Royal Wedding Invitation',
  description: 'Digital wedding invitation dengan tema royal webtoon',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
