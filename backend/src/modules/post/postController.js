import postService from './postService.js';

export const createPost = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.user.id, req.body);
    res.status(201).json({ post });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const posts = await postService.getPosts();
    res.json({ posts });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ post });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await postService.likePost(req.user.id,
      req.user.username,
      req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ post });
  } catch (error) {
    next(error);
  }
};

export const commentOnPost = async (req, res, next) => {
  try {
    const post = await postService.commentOnPost(req.user.id, req.user.username, req.params.id, req.body);

    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ post });
  } catch (error) {
    next(error);
  }
};
