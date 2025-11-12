import { useMessages } from "../api/transcriptApi";
import type { Message } from "../types/api";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  Chip,
} from "@mui/material";

interface MessagesListProps {
  transcriptId: string | null;
}

export function MessagesList({ transcriptId }: MessagesListProps) {
  const { data: messages, isLoading, error } = useMessages(transcriptId);

  if (!transcriptId) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Select a transcript to view messages
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 2 }}>
          <Alert severity="error">Error loading messages</Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {messages && messages.length > 0 ? (
          <Stack spacing={2}>
            {messages.map((message: Message) => (
              <Paper
                key={message.id}
                elevation={2}
                sx={{
                  p: 2,
                  bgcolor:
                    message.role === "doctor"
                      ? "rgba(25, 118, 210, 0.08)"
                      : "rgba(156, 39, 176, 0.08)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Chip
                    label={message.role === "doctor" ? "Doctor" : "Patient"}
                    color={message.role === "doctor" ? "primary" : "secondary"}
                    size="small"
                  />
                  {message.timestamp && (
                    <Typography variant="caption" color="text.secondary">
                      {new Date(message.timestamp).toLocaleString()}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body1">{message.body}</Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No messages found
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
