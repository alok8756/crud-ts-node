import { Request, Response, NextFunction } from "express";
const jwt= require('jsonwebtoken')
import dotenv from 'dotenv';

dotenv.config();

export const isAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.body.authorisation;
    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }
  
    try {
         const decoded = await jwt.verify(token, process.env.JWT_SECRET || "alok1234");
        if(!decoded)
            return res.status(401).json({ message: "Token is not valid or it's expired" });
       return next(); 
    } catch (err) {
        
        return res.status(401).json({ message: "Token not match error occured!" });
    }
};
