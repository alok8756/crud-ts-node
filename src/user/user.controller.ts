import { Request, Response } from 'express';
import * as userService from './user.repo';
import dotenv from 'dotenv'
import { userSchema, validateObjectIdAndCheckExistence } from './user.validation';
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

dotenv.config();

  async function addUser(req: Request, res: Response){
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) 
      return res.status(400).json({ errors: error.details.map(detail => detail.message) });

  try {
    const user = await userService.addUser(req.body);

    res.status(201).json({message: 'Register successfully',name:user.name,email:user.email});
  } catch (err) {
    res.status(400).json({ error: 'User Registeration failed'});
  }
};

 async function loginUser(req:Request,res:Response){
  try {
    const user = await userService.loginUser({email:req.body.email});
    if (!user) 
      return res.status(404).json({ message: 'User not register, please register' });
     
    const isPasswordequal=await bcrypt.compare(req.body.password ,user.password);

    if(!isPasswordequal)
      return res.status(404).json({ message: 'Password not match, please write correct password!' });

      const tokenObject={
        _id:user._id,
        fullName:user.name,
        email:user.email
      }

      const jwtToken= await jwt.sign(tokenObject,process.env.JWT_SECRET, {expiresIn:'4h'});
      
      res.status(200).json({message: 'Login Successfully!', jwtToken,tokenObject});
     
  } catch (err) {
    res.status(401).json({ error: 'Login failed!' });
  }
};


 async function getUserById (req: Request, res: Response){
  const { id } = req.params;

  if (id && !await validateObjectIdAndCheckExistence(id)) {
    return res.status(404).json({ message: 'Invalid id, please give the valid id for receive this users details!' });
  }

  try {
    const user = await userService.getUserById(id);
    if (!user) 
         return res.status(404).json({ message: 'Data for this is not find,please try again!' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'User details through this id getting failed.' });
  }
};

 async function updateUserById (req: Request, res: Response){
  const { id } = req.params;
  const { error } = userSchema.validate({email:req.body.email,password:req.body.password,name:req.body.name}, { abortEarly: false });
  
  if (error) 
     return res.status(400).json({ errors: error.details.map(detail => detail.message) });

  if (!await validateObjectIdAndCheckExistence(id)) {
    return res.status(404).json({ message: 'Invalid id, please give the valid id for details update'});
  }

  try {
    const user = await userService.updateUserById(id, req.body);
    if (!user) 
         return res.status(404).json({ message: 'User details not update, please try again'});
    res.json({message:'updated successfully',data:user});
  } catch (err) {
    res.status(400).json({ error: 'User not updated failed' });
  }
};

 async function deleteUserById (req: Request, res: Response) {
  const { id } = req.params;

  if (id && !await validateObjectIdAndCheckExistence(id)) {
    return res.status(404).json({ message: 'Invalid id, please give the valid id for deletion' });
  }

  try {
    const user = await userService.deleteUserById(id);
    if (!user) 
         return res.status(404).json({ message: 'User not deleted, please try again' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'User deletion failed!' });
  }
};


 async function allUsers(req: Request, res: Response) {
 
  try {
    const users = await userService.listUsers();
    if(!users)
      res.status(400).json({ error: 'All Users data not found'});

      res.json(users);
  } catch (err) {
    res.status(400).json({ error: 'All Users data finding failed'});
  }
};

module.exports={
   addUser,
   loginUser,
   getUserById,
   updateUserById,
   deleteUserById,
   allUsers
};

