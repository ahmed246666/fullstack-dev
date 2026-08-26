import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastProvider } from '../context/ToastContext';

export const metadata: Metadata = {
  title: 'Full-Stack Management App | AZM Squad',
  description: 'Enterprise Full-Stack Application built with Next.js, Express, and SQLite',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Navbar />
          <main className="main-content">
            <div className="container">
              {children}
            </div>
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
