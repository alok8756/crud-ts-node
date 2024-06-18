import { Request, Response } from 'express';
import * as userService from './user.services';
import dotenv from 'dotenv'
import { userSchema, validateObjectIdAndCheckExistence } from './user.validation';
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

dotenv.config();


export const addUser = async (req: Request, res: Response) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) 
      return res.status(400).json({ errors: error.details.map(detail => detail.message) });

  try {
    const user = await userService.addUser(req.body);
    user.password=undefined;
    res.status(201).json({message: 'Register successfully', data: user});
  } catch (err) {
    res.status(400).json({ error: 'User not Register' });
  }
};

export const loginUser= async(req:Request,res:Response)=>{
  try {
    const user = await userService.loginUser(req.body);
    if (!user) 
      return res.status(404).json({ message: 'login failed, Invalid username/password' });
     
    const isPasswordequal=await bcrypt.compare(req.body.password,user.password);

    if(!isPasswordequal)
      return res.status(404).json({ message: 'login failed, Invalid username/password' });

      const tokenObject={
        _id:user._id,
        fullName:user.name,
        email:user.email
      }

      const jwtToken=jwt.sign(tokenObject,process.env.JWT_SECRET, {expiresIn:'4h'});
      

    res.status(200).json({message: 'Login successfully', jwtToken,tokenObject});
  } catch (err) {
    res.status(401).json({ error: 'Login failed' });
  }
};


export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!await validateObjectIdAndCheckExistence(id)) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    const user = await userService.getUserById(id);
    if (!user) 
         return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'User not found' });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  // const { error } = userSchema.validate(req.body, { abortEarly: false });
  
  // if (error) 
  //    return res.status(400).json({ errors: error.details.map(detail => detail.message) });

  if (!await validateObjectIdAndCheckExistence(id)) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    const user = await userService.updateUserById(id, req.body);
    if (!user) 
         return res.status(404).json({ message: 'User not found' });
    res.json({message:'updated successfully',data:user});
  } catch (err) {
    res.status(400).json({ error: 'User not updated' });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!await validateObjectIdAndCheckExistence(id)) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    const user = await userService.deleteUserById(id);
    if (!user) 
         return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'User not deleted' });
  }
};

export const allUsers = async (req: Request, res: Response) => {
  try {
    
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: 'Users not found' });
  }
};
