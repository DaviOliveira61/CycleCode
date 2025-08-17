import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as userService from '../services/userService.js';
import { comparePassword } from '../utils/password.js';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'A user with this email already exists.' });
        }

        const newUser = await userService.createUser({
            email,
            password,
            name: name,
            role: 'READER',
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const login = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = await userService.findUserByEmail(email);
        if (!user) {
            // Use a generic message to prevent email enumeration attacks
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role }, 
            process.env.JWT_SECRET!, 
            { expiresIn: '1d' } 
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed.' });
    }

};
