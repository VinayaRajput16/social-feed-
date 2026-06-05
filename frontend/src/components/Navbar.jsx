/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import api from "../api/axios.js";

function Navbar() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    setProfile(null);
    navigate("/login");
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/users/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);

  // Get initials for avatar fallback
  const initials = profile?.user?.username
    ? profile.user.username.charAt(0).toUpperCase()
    : "?";

  // Generate a consistent color from username
  const avatarColors = ["#5C6BC0", "#26A69A", "#EF5350", "#AB47BC", "#FFA726", "#29B6F6"];
  const colorIndex = profile?.user?.username
    ? profile.user.username.charCodeAt(0) % avatarColors.length
    : 0;
  const avatarBg = avatarColors[colorIndex];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        borderBottom: "1px solid #e0e0e0",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Typography
          variant="h6"
          onClick={() => navigate("/")}
          sx={{
            cursor: "pointer",
            fontWeight: 800,
            fontSize: "1.3rem",
            letterSpacing: "-0.5px",
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          MyApp
        </Typography>

        {/* Right side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isLoggedIn && profile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 0.75,
                borderRadius: "40px",
                bgcolor: "#f5f7fa",
                border: "1px solid #e8ecf0",
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "#edf0f5",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: avatarBg,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  boxShadow: `0 0 0 2px #fff, 0 0 0 3px ${avatarBg}40`,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ lineHeight: 1 }}>
                <Typography
                  sx={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#1a1a2e",
                    letterSpacing: "0.01em",
                  }}
                >
                  {profile.user.username}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "#8a94a6",
                    letterSpacing: "0.01em",
                    mt: 0.1,
                  }}
                >
                  {profile.user.email}
                </Typography>
              </Box>
            </Box>
          )}

          {!isLoggedIn && (
            <>
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={{
                  color: "#555",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 2,
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/signup")}
                disableElevation
                sx={{
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 2.5,
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                }}
              >
                Sign up
              </Button>
            </>
          )}

          {isLoggedIn && (
            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{
                color: "#e53935",
                borderColor: "#ffcdd2",
                fontWeight: 600,
                fontSize: "0.8rem",
                textTransform: "none",
                borderRadius: "8px",
                px: 2,
                "&:hover": {
                  bgcolor: "#fff5f5",
                  borderColor: "#e53935",
                },
              }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;