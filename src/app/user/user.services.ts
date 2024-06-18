import { IUser, User } from './user.model';
const bcrypt = require('bcrypt');

// Check if a user exists by ID
export const existsById = async (id: string): Promise<boolean> => {
  const userExists = await User.exists({ _id: id });
  return !!userExists; 
};

// Add a new user
export const addUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  user.password= await bcrypt.hash(userData.password,10);
  return await user.save();
};

//login user
export const loginUser = async (userData: Partial<IUser>): Promise<IUser | null> => {
  const user = User.findOne({email: userData.email});
  return await user;
};

// Get a user by ID
export const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id).exec();
};

// Update a user by ID
export const updateUserById = async (id: string, userData: Partial<IUser>): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, userData, { new: true }).exec();
};

// Delete a user by ID
export const deleteUserById = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id).exec();
};

// List all users
export const listUsers = async (): Promise<IUser[]> => {
  return await User.find().exec();
};
