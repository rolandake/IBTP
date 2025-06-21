import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await axiosClient.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des projets :", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = async () => {
    if (!title.trim() || !location.trim()) return;
    try {
      await axiosClient.post("/projects", { title, location });
      setTitle("");
      setLocation("");
      fetchProjects();
    } catch (err) {
      console.error("Erreur lors de l'ajout du projet :", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const handleChat = (projectId) => {
    navigate(`/chat/${projectId}`);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 6, px: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Mes projets BTP
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
          <TextField
            label="Titre"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Lieu"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button variant="contained" onClick={handleAdd}>
            Ajouter
          </Button>
        </Box>

        <List>
          {projects.map((p) => (
            <ListItem
              key={p._id}
              divider
              secondaryAction={
                <Box>
                  <IconButton onClick={() => handleDelete(p._id)}>
                    <DeleteIcon />
                  </IconButton>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1 }}
                    onClick={() => handleChat(p._id)}
                  >
                    Ouvrir Chat
                  </Button>
                </Box>
              }
            >
              <ListItemText primary={p.title} secondary={p.location} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
