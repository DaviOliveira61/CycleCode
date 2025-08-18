'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('Header');

  return (
    <header className="bg-background-secondary sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="font-bold text-2xl text-text-primary hover:text-accent-hover transition-colors">
          CycleCode
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-text-secondary hover:text-accent-primary transition-colors">
            {t('home')}
          </Link>
          <Link href="/about" className="text-text-secondary hover:text-accent-primary transition-colors">
            {t('about')}
          </Link>

          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}