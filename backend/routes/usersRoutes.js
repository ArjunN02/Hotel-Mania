import express from 'express';
import {
  getAllUsers,
  updateProfile,
  getUserProfile,
  updatePassword
} from "../controllers/usersController.js";
import { verifyToken, verifyUser } from '../middleware/VerifyToken.js';

const router = express.Router();

//GET USERS
router.post('/allUsers', getAllUsers)
//router.post('/allUsers',verifyUser, getAllUsers)
//router.post('/profile', getUserProfile)
router.post('/profile',verifyUser, getUserProfile)
router.patch('/updateProfile', updateProfile)
//router.patch('/updateProfile',verifyUser, updateProfile)
router.patch('/updatePassword', updatePassword)
// router.patch('/updatePassword',verifyUser, updatePassword)



export default router;