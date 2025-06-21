import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
} from "@mui/material";

export default function Chat() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // ✅ manquant dans ton code
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchProject() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    async function fetchMessages() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`/api/conversations/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMessages();
  }, [projectId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `/api/gpt/${projectId}`,
        { prompt: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [
        ...prev,
        { role: "user", content: input },
        { role: "assistant", content: res.data },
      ]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chat pour le projet : {project?.name || "Chargement..."}
      </Typography>
      <Paper sx={{ height: "60vh", overflowY: "auto", p: 2, mb: 2 }}>
        {messages.map((m, i) => (
          <Box
            key={i}
            sx={{
              mb: 1,
              p: 1,
              bgcolor: m.role === "user" ? "primary.main" : "grey.300",
              color: m.role === "user" ? "primary.contrastText" : "black",
              borderRadius: 1,
              maxWidth: "80%",
              ml: m.role === "user" ? "auto" : 0,
            }}
          >
            {m.content}
          </Box>
        ))}
        <div ref={scrollRef} />
      </Paper>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pose ta question au GPT BTP..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button variant="contained" onClick={sendMessage}>
          Envoyer
        </Button>
      </Box>
    </Container>
  );
}
