/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  TextField,
  Avatar,
  Divider,
  Collapse,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SendIcon from "@mui/icons-material/Send";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import api from "../api/axios.js";

function PostCard({ postId }) {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const commentsEndRef = useRef(null);
  const commentsBoxRef = useRef(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await api.get(`/posts/${postId}`);
        setPost(res.data.post);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    }
    fetchPost();
  }, [postId]);

  // Scroll to bottom of comments when new comment added
  useEffect(() => {
    if (showComments && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [post?.comments?.length, showComments]);

  if (!post)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );

  const handleLike = async () => {
    setIsLikeLoading(true);
    try {
      const res = await api.post(`/posts/${post._id}/like`);
      const updatedPost = res.data.post || res.data;
      setPost((prev) => ({
        ...prev,
        likeCount:
          updatedPost.likeCount !== undefined
            ? updatedPost.likeCount
            : (prev.likeCount || 0) + (prev.isLiked ? -1 : 1),
        isLiked:
          updatedPost.isLiked !== undefined ? updatedPost.isLiked : !prev.isLiked,
      }));
    } catch (err) {
      console.error("Error liking post:", err);
      setPost((prev) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likeCount: prev.isLiked
          ? (prev.likeCount || 0) - 1
          : (prev.likeCount || 0) + 1,
      }));
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsCommentLoading(true);
    try {
      const res = await api.post(`/posts/${post._id}/comment`, {
        text: newComment,
      });
      const updatedPost = res.data.post || res.data;
      setPost(updatedPost);
      setNewComment("");
      setShowComments(true);
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setIsCommentLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const likeCount = post.likeCount || 0;
  const isLiked = post.isLiked || false;
  const comments = post.comments || [];

  return (
    <Card
      elevation={0}
      sx={{
        maxWidth: 468,
        mx: "auto",
        mb: 3,
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
      }}
    >
      {/* Header */}
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 36,
              height: 36,
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            {post.user?.username?.charAt(0).toUpperCase() || "U"}
          </Avatar>
        }
        title={
          <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            {post.user?.username || "Unknown User"}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.7rem" }}>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        }
        sx={{ py: 1.5, px: 2 }}
      />

      {/* Post Image */}
      {post.image && (
        <Box
          component="img"
          src={post.image}
          alt="Post"
          sx={{
            width: "100%",
            maxHeight: 468,
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      {/* Post Text */}
      {post.text && (
        <CardContent sx={{ px: 2, py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
            {post.text}
          </Typography>
        </CardContent>
      )}

      {/* Action bar */}
      <CardActions disableSpacing sx={{ px: 1.5, pt: 0.5, pb: 0.5 }}>
        {/* Like */}
        <IconButton
          onClick={handleLike}
          disabled={isLikeLoading}
          size="small"
          sx={{
            color: isLiked ? "#ed4956" : "text.secondary",
            transition: "transform 0.15s ease, color 0.15s ease",
            "&:hover": { transform: "scale(1.15)", bgcolor: "transparent" },
            "&:active": { transform: "scale(0.9)" },
          }}
        >
          {isLiked ? (
            <FavoriteIcon sx={{ fontSize: 24 }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 24 }} />
          )}
        </IconButton>

        {/* Comment toggle */}
        <IconButton
          onClick={() => setShowComments((s) => !s)}
          size="small"
          sx={{
            color: "text.secondary",
            ml: 0.5,
            "&:hover": { bgcolor: "transparent", transform: "scale(1.1)" },
          }}
        >
          <ChatOutlinedIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </CardActions>

      {/* Like count */}
      {likeCount > 0 && (
        <Box sx={{ px: 2, pb: 0.5 }}>
          <Typography variant="body2" fontWeight={700} fontSize="0.82rem">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </Typography>
        </Box>
      )}

      {/* Comments count toggle row */}
      {comments.length > 0 && (
        <Box
          onClick={() => setShowComments((s) => !s)}
          sx={{
            px: 2,
            pb: 1,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          <Typography variant="body2" color="text.disabled" fontSize="0.8rem">
            {showComments ? "Hide" : `View all ${comments.length} comment${comments.length !== 1 ? "s" : ""}`}
          </Typography>
          {showComments ? (
            <KeyboardArrowUpIcon sx={{ fontSize: 16, color: "text.disabled" }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "text.disabled" }} />
          )}
        </Box>
      )}

      {/* Collapsible comments — fully scrollable, ALL comments rendered */}
      <Collapse in={showComments} timeout="auto">
        <Box
          ref={commentsBoxRef}
          sx={{
            maxHeight: 220,
            overflowY: "auto",
            px: 2,
            pb: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.2,
            /* Custom scrollbar */
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "divider",
              borderRadius: 4,
            },
          }}
        >
          {[...comments] 
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
            .map((comment, index) => (
              <Box key={comment._id || index} sx={{
                display: "flex", flexDirection: "column", bgcolor: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.55)",
                boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
                borderRadius: 3,
              }}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ fontSize: "0.78rem", flexShrink: 0 }}
                  >
                    {comment.username || "Unknown"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ fontSize: "0.82rem", lineHeight: 1.5 }}
                  >
                    {comment.text}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.68rem", mt: 0.2 }}>
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            ))}
          {/* Scroll anchor */}
          <div ref={commentsEndRef} />
        </Box>
      </Collapse>

      <Divider />

      {/* Add comment input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1,
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          size="small"
          placeholder="Add a comment…"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isCommentLoading}
          InputProps={{ disableUnderline: true }}
          sx={{
            "& input": { fontSize: "0.85rem", py: 0.5 },
          }}
        />
        <IconButton
          onClick={handleAddComment}
          disabled={!newComment.trim() || isCommentLoading}
          size="small"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            "&.Mui-disabled": { color: "action.disabled" },
            "&:hover": { bgcolor: "transparent" },
          }}
        >
          <SendIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Card>
  );
}

export default PostCard;