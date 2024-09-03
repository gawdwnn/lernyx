import { ThemeProvider } from '@/components/theme';
import { ReactQueryProvider } from '@/react-query/provider';
import { ReduxProvider } from '@/redux/provider';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

const siteConfig = {
  name: 'Lernyx',
  description: 'Lernyx is a platform for learning and sharing knowledge.',
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: [
    {
      url: '/',
      href: '/',
    },
  ],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={jakarta.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <ReduxProvider>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </ReduxProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
