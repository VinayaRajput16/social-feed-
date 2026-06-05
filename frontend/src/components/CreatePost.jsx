/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Avatar,
  TextField,
  IconButton,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import {
  CameraAlt,
  Image,
  Close,
  Send,
} from "@mui/icons-material";
import api from "../api/axios.js";

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setImagePreview(previewUrl);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !selectedFile) {
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const res = await api.post("/posts", {
        text: text.trim(),
        image: imageUrl,
      });

      if (res.status === 201) {
        setText("");
        setSelectedFile(null);

        if (imagePreview?.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreview);
        }

        setImagePreview("");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        onPostCreated?.();
      }
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 520,
        mx: "auto",
        borderRadius: 4,
        border: "1px solid rgba(15,23,42,0.08)",
        bgcolor: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar sx={{ width: 42, height: 42 }}>R</Avatar>

          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={5}
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: 15,
                  px: 0,
                  py: 0.5,
                },
              }}
            />

            {imagePreview && (
              <Box
                sx={{
                  mt: 1.5,
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid rgba(15,23,42,0.08)",
                }}
              >
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{
                    width: "100%",
                    maxHeight: 320,
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <IconButton
                  size="small"
                  onClick={() => {
                    if (imagePreview?.startsWith("blob:")) {
                      URL.revokeObjectURL(imagePreview);
                    }

                    setImagePreview("");
                    setSelectedFile(null);

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(0,0,0,0.55)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.7)",
                    },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            )}

            <Divider sx={{ my: 1.5 }} />

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={0.5}>
                <IconButton
                  component="label"
                  sx={{ color: "primary.main" }}
                  title="Add image"
                >
                  <CameraAlt />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </IconButton>

                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ color: "primary.main" }}
                  title="Choose image"
                >
                  <Image />
                </IconButton>
              </Stack>

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || (!text.trim() && !selectedFile)}
                endIcon={<Send />}
                sx={{
                  textTransform: "none",
                  borderRadius: 999,
                  px: 2.5,
                  fontWeight: 600,
                }}
              >
                {loading ? "Posting..." : "Post"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default CreatePost;