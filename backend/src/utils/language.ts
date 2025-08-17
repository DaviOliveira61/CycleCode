import { Language } from '@prisma/client';
import { Request } from 'express';

export const getLanguage = (req: Request): Language => {
    const langQuery = req.query.lang as string;
    if (langQuery) {
        if (langQuery.toUpperCase() === Language.EN_US) {
            return Language.EN_US;
        }

        if (langQuery.toUpperCase() === Language.PT_BR) {
            return Language.PT_BR;
        }
    }

    const langHeader = req.headers['accept-language'];
    if (langHeader) {
        if (langHeader.toLowerCase().includes('en')) {
            return Language.EN_US;
        }
        if (langHeader.toLowerCase().includes('pt')) {
            return Language.PT_BR;
        }
    }

    return Language.PT_BR;
};
