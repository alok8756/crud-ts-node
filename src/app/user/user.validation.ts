import { Request, Response, NextFunction } from 'express';
import Joi, { allow } from 'joi';
import mongoose from 'mongoose';
import * as userService from './user.services';



// Joi schema for user input validation
export const userSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    'string.base': 'Name must be string',
    'string.min': 'Name must be at least 2 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().optional().allow('').empty('').messages({
    'string.email': 'Email must be valid'
  }),
  password: Joi.string().min(8).pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).optional().allow('').empty('').messages({
    'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, and one digit',
    'string.min': 'Password must be at least 8 characters'
  }),
});

export const validateObjectIdAndCheckExistence = async (id: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }

  return await userService.existsById(id);
};
