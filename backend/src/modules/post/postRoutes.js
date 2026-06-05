// POST   /api/posts
// GET    /api/posts
// GET    /api/posts/:id

// POST   /api/posts/:id/like
// POST   /api/posts/:id/comment
import express from 'express';
import { createPost, getPosts, getPostById, likePost, commentOnPost } from './postController.js';
import authMiddleware  from '../../middleware/authMiddleware.js';

const router = express.Router();

// Create a new post
router.post('/', authMiddleware, createPost);

// Get all posts
router.get('/', getPosts);

// Get a specific post by ID
router.get('/:id', getPostById);

// Like a post
router.post('/:id/like', authMiddleware, likePost);

// Comment on a post
router.post('/:id/comment', authMiddleware, commentOnPost);

export default router;