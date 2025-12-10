import { Suspense } from 'react';
import { Roboto } from 'next/font/google';
import { LocalizedStringProvider } from 'react-aria-components/i18n';

import './globals.css';

const roboto = Roboto({
  weight: ['400', '900'],
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={roboto.className}>
        <LocalizedStringProvider locale="it" />
        {/*
          this is without fallback to ensure there's no loading flash
          https://github.com/vercel/next.js/issues/86739
        */}
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
