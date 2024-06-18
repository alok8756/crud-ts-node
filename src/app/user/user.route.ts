const express = require('express')
import { Request,Response } from 'express';
import { addUser, loginUser, getUserById, updateUserById, deleteUserById, allUsers } from './user.controller';
import { isAuthenticatedUser } from './user.auth.middleware';



const router = express.Router();

router.post('/register', addUser);
router.post('/login',loginUser);
router.get('/:id',isAuthenticatedUser, getUserById);
router.put('/:id',isAuthenticatedUser , updateUserById);
router.delete('/:id',isAuthenticatedUser , deleteUserById);
router.get('/users' , isAuthenticatedUser , allUsers);

module.exports = router;