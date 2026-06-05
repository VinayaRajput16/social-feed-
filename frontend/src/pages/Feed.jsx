/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Alert,
  Skeleton,
} from "@mui/material";
import api from "../api/axios.js";
import CreatePost from "../components/CreatePost.jsx";
import Navbar from "../components/Navbar.jsx";
import PostCard from "../components/PostCard.jsx";

function PostSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        mb: 3,
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Skeleton variant="circular" width={36} height={36} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="35%" height={14} />
          <Skeleton variant="text" width="50%" height={12} sx={{ mt: 0.4 }} />
        </Box>
      </Box>
      <Skeleton variant="rectangular" width="100%" height={280} sx={{ borderRadius: 1 }} />
      <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
        <Skeleton variant="circular" width={28} height={28} />
        <Skeleton variant="circular" width={28} height={28} />
      </Box>
      <Skeleton variant="text" width="25%" height={14} sx={{ mt: 1 }} />
      <Skeleton variant="text" width="80%" height={14} sx={{ mt: 0.5 }} />
    </Box>
  );
}

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/posts");
      setPosts(res.data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }
  const pageBg = {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: `
    radial-gradient(circle at top left, rgba(25, 118, 210, 0.12), transparent 35%),
    radial-gradient(circle at bottom right, rgba(156, 39, 176, 0.10), transparent 30%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)
  `,
  };
  return (
    <Box sx={{ ...pageBg }}>
      <Navbar />

      <Container
        maxWidth="lg"
        sx={{
          pt: 5,
          pb: 8,
          display: "flex",
          gap: 6,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {/* Main feed column — fixed width, centered */}
        <Box
          sx={{
            width: { xs: "100%", md: 468 },
            flexShrink: 0,
          }}
        >
          {/* Create Post */}
          <Box sx={{ mb: 3 }}>
            <CreatePost onPostCreated={fetchPosts} />
          </Box>

          {/* Loading skeletons */}
          {loading && (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2, mb: 2, fontSize: "0.85rem" }}>
              {error}
            </Alert>
          )}

          {/* Empty state */}
          {!loading && posts.length === 0 && !error && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "12px",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
                No posts yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Be the first to share something with your community!
              </Typography>
            </Box>
          )}

          {/* Posts */}
          {!loading &&
            posts.length > 0 &&
            posts.map((post) => (
              <Box key={post._id} sx={{ width: "100%", mb: 3 }}>
                <PostCard postId={post._id} />
              </Box>
            ))}
        </Box>

      </Container>
    </Box>
  );
}

export default Feed;