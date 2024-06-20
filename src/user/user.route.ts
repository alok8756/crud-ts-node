const express = require('express')
import { Request,Response } from 'express';
// const { addUser, loginUser, getUserById, updateUserById, deleteUserById, allUsers } from require('./user.controller');
import { isAuthenticatedUser } from '../core/middleware/auth.middleware';
const userControllers=require('./user.controller')

const router = express.Router();

router.post('/register', userControllers.addUser);
router.post('/login',userControllers.loginUser);

router.get('/allUsers',isAuthenticatedUser, userControllers.allUsers);

router.route('/:id')
      .get(isAuthenticatedUser, userControllers.getUserById)
      .put(isAuthenticatedUser , userControllers.updateUserById)
      .delete(isAuthenticatedUser , userControllers.deleteUserById);



module.exports = router;