import type { Metadata, Viewport } from 'next';
import { Archivo, Archivo_Narrow, IBM_Plex_Mono } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { THEME_BOOT_SCRIPT } from '@/lib/theme';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-archivo',
  display: 'swap',
});
const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-archivo-narrow',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ADI Staking',
  description:
    'The $ADI staking program allocates a fixed ecosystem participation incentive to time-locked positions on ADI Chain.',
};

export const viewport: Viewport = {
  themeColor: '#05070D',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${archivoNarrow.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Set the theme before first paint so the page never flashes the wrong palette. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
