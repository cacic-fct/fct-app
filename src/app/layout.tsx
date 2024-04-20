import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const env = process.env.NODE_ENV;
const baseUrl = process.env.baseUrl;
const plausibleUrl = process.env.plausibleUrl;

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FCT App',
  description:
    'Calendário de eventos da FCT Unesp, Faculdade de Ciências e Tecnologia da Universidade Estadual Paulista Júlio de Mesquita Filho',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {env === 'production' ? (
          <script defer data-domain={baseUrl} src={plausibleUrl + `/js/script.js`} />
        ) : (
          <script defer data-domain="localhost" src={plausibleUrl + `/js/script.local.js`} />
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
