/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      console.log("Registered:", res.data);

      // clear inputs
      setUsername("");
      setEmail("");
      setPassword("");

      // navigate to login page
      navigate("/login");
    } catch (err) {
      console.error("Error registering:", err);
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        ...pageBg,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 350,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Signup;
