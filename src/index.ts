import mongoose from "mongoose";
import connectDB from "./app/user/user.db.config";
import express from 'express';
import dotenv from "dotenv";
import Joi from 'joi'; 
const bodyParser= require('body-parser');
const  userRoutes =require('./app/user/user.route');


dotenv.config();


const app = express();
const PORT = process.env.PORT || 8080;


const portSchema = Joi.number().integer().min(0).max(65535).required();


const { error } = portSchema.validate(PORT);
if (error) {
  console.error(`Invalid PORT number: ${error.message}`);
  process.exit(1);
}

// Connect to MongoDB
connectDB();


app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/api/v1', userRoutes);



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
