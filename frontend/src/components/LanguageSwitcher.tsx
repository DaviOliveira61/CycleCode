'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = pathname.split('/')[1] || 'pt'; // 'pt' como fallback

  const handleSelect = (nextLocale: string) => {

    const newPath = pathname.startsWith(`/${currentLocale}`)
      ? pathname.substring(currentLocale.length + 1)
      : pathname;

    const finalPath = newPath || '/';

    startTransition(() => {
      router.replace(`/${nextLocale}${finalPath}`);
    });
    setIsOpen(false);
  };

  const locales = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 bg-background-primary rounded-full text-text-secondary hover:text-accent-primary transition-colors focus:outline-none"
        aria-label="Selecionar idioma"
        disabled={isPending}
      >
        {currentLocale.toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-background-secondary rounded-md shadow-lg py-1 w-32 z-20">
          {locales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => handleSelect(loc.code)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentLocale === loc.code
                  ? 'text-accent-primary'
                  : 'text-text-primary hover:bg-background-primary'
              }`}
              disabled={isPending}
            >
              {loc.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}