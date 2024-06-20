import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
} 

const userSchema: Schema = new Schema({
  name: { 
     type: String,
     required: true,
     unique:true 
    },
  email: { 
     type: String
    },
  password: { 
     type: String
     }
});

export const User = mongoose.model<IUser>('User', userSchema);
