/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password.");
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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fafafa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        ...pageBg,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 350 }}>

        {/* Card */}
        <Box
          sx={{
            bgcolor: "#fff",
            border: "1px solid #dbdbdb",
            borderRadius: 2,
            px: 5,
            pt: 5,
            pb: 4,
            mb: 2,
          }}
        >
          {/* Logo / Brand */}
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontFamily: "'Dancing Script', cursive",
              fontWeight: 700,
              mb: 4,
              color: "text.primary",
              letterSpacing: -0.5,
            }}
          >
            MyApp
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: "0.8rem", py: 0.5 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="small"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              sx={{ mb: 1.5, bgcolor: "#fafafa", borderRadius: 1 }}
            />

            <TextField
              fullWidth
              size="small"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2, bgcolor: "#fafafa", borderRadius: 1 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!username.trim() || !password.trim() || loading}
              disableElevation
              sx={{
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.9rem",
                borderRadius: 1.5,
              }}
            >
              {loading ? "Logging in…" : "Log in"}
            </Button>
          </form>

          <Box sx={{ display: "flex", alignItems: "center", my: 2.5, gap: 1.5 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="caption" color="text.disabled" fontWeight={600}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <Typography variant="body2" align="center" color="text.secondary" fontSize="0.82rem">
            Forgot password?{" "}
            <Box
              component="span"
              sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600 }}
            >
              Get help
            </Box>
          </Typography>
        </Box>

        {/* Sign up link */}
        <Box
          sx={{
            bgcolor: "#fff",
            border: "1px solid #dbdbdb",
            borderRadius: 2,
            py: 2.5,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary" fontSize="0.88rem">
            Don't have an account?{" "}
            <Box
              component="span"
              onClick={() => navigate("/signup")}
              sx={{
                color: "primary.main",
                fontWeight: 700,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign up
            </Box>
          </Typography>
        </Box>

      </Box>
    </Box>
  );
}

export default Login;