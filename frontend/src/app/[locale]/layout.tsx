import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import '../globals.css';
import Header from '@/components/Header';
import { I18nProvider } from '@/lib/i18n';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  title: 'CycleCode Tech',
  description: 'Onde o código encontra o caos e, ocasionalmente, a sabedoria.',
};

async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error("Could not load messages for locale:", locale, error);
    return {};
  }
}

export default async function RootLayout({
  children,
  params, 
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${merriweather.variable}`}>
      <body className="bg-background-primary text-text-primary font-sans">
        <I18nProvider messages={messages}>
          <Header />
          <main>{children}</main>
        </I18nProvider>
      </body>
    </html>
  );
}