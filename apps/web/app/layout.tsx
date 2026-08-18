import { Fraunces, Outfit } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
});

export const metadata: Metadata = {
  title: {
    default: 'EstateX — Find a place you’ll love',
    template: '%s | EstateX',
  },
  description:
    'Discover premium homes, apartments, villas and commercial spaces across Pakistan.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh bg-paper font-sans text-ink antialiased">
        <AuthProvider>
          <div className="flex min-h-dvh flex-col">
            <Navbar />
            <main className="flex-1 animate-rise-in">{children}</main>
            <Footer />
          </div>
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              className:
                '!rounded-2xl !border !border-ink/10 !bg-paper !text-ink !shadow-[0_18px_40px_rgba(22,21,19,0.12)]',
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
