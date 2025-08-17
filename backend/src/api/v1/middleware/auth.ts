import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: { userId: number; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No tokens provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string };
        req.user = decoded;
        next(); 
    } catch (error) {
        res.status(403).json({ error: 'Invalid token.' });
    }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if(req.user?.role !== 'ADMIN'){
        return res.status(403).json({ error: 'Forbidden. Access is restricted to administrators.' });
    }
    next();
};
