import express from 'express';
import authRoutes from '../modules/auth/authRoutes.js';
import userRoutes from '../modules/user/userRoutes.js';
import postRoutes from '../modules/post/postRoutes.js';

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/posts', postRoutes);

export default routes;