import express from 'express';
import { forgotPassword, resetPassword, UserLogin, UserSignup } from '../Controller/userController.js';

const UserRouter = express();

UserRouter.post('/signup',UserSignup);
UserRouter.post('/login',UserLogin);
UserRouter.post('/forgot',forgotPassword);
UserRouter.post('/reset',resetPassword);

export default UserRouter;