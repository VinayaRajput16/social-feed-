import Post from '../../models/Post.js';

const createPost = async (userId, postData) => {
    try {
        const { text, image } = postData;

        if (!text?.trim() && !image?.trim()) {
            throw new Error("Either text or image is required");
        }

        const post = new Post({
            ...postData,
            user: userId
        });

        await post.save();

        return post;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getPosts = async () => {
    try {
        const posts = await Post.find().populate('user', 'username').sort({ createdAt: -1 });
        return posts;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getPostById = async (postId) => {
    try {
        const post = await Post.findById(postId).populate('user', 'username');
        return post;
    } catch (error) {
        throw new Error(error.message);
    }
};

const likePost = async (userId, username, postId) => {
    try {
        const post = await Post.findById(postId);

        if (!post) {
            throw new Error("Post not found");
        }

        const likeIndex = post.likes.findIndex(
            (like) => like.user.toString() === userId.toString()
        );

        if (likeIndex !== -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // Like
            post.likes.push({
                user: userId,
                username
            });
        }

        await post.save();

        await post.populate("user", "username");

        return post;
    } catch (error) {
        throw new Error(error.message);
    }
};

const commentOnPost = async (userId, username, postId, commentData) => {
    try {
        const post = await Post.findById(postId);
        if (!post) return null;

        if (!commentData.text?.trim()) {
            throw new Error("Comment cannot be empty");
        }

        post.comments.push({ ...commentData, user: userId, username });
        await post.save();

        await post.populate("user", "username");

        return post;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    createPost,
    getPosts,
    getPostById,
    likePost,
    commentOnPost
};