'use client';

import { createContext, useContext, ReactNode } from 'react';

type Messages = Record<string, Record<string, string>>;

const MessagesContext = createContext<Messages | null>(null);

export function I18nProvider({ messages, children }: { messages: Messages; children: ReactNode }) {
    return (
        <MessagesContext.Provider value={messages}>
            {children}
        </MessagesContext.Provider>
    );
}

export function useTranslations(namespace: string) {
    const messages = useContext(MessagesContext);

    if (!messages) {
        throw new Error("useTranslations must be used within an I18nProvider");
    }
    return (key: string): string => {
        return messages[namespace]?.[key] || `${namespace}.${key}`;
    };
}