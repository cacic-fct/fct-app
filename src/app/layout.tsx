import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import '@/styles/globals.scss';

import { NavBar } from '@/components/NavBar';

const inter = Roboto({ weight: ['300', '400', '500', '700', '900'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FCT App',
  description:
    'Calendário de eventos da FCT Unesp, Faculdade de Ciências e Tecnologia da Universidade Estadual Paulista Júlio de Mesquita Filho',
  icons: {
    icon: '/static/favicon.ico',
  },
};

const env = process.env.NODE_ENV;
const baseUrl = process.env.baseUrl;
const plausibleUrl = process.env.plausibleUrl;

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

      <body className={inter.className + ' App'}>
        <main>{children}</main>
        <NavBar />
      </body>
    </html>
  );
}
