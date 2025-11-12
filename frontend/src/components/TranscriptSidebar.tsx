import { useTranscripts } from "../api/transcriptApi";
import type { Transcript } from "../types/api";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";

interface TranscriptSidebarProps {
  selectedTranscriptId: string | null;
  onSelectTranscript: (transcriptId: string) => void;
}

export function TranscriptSidebar({
  selectedTranscriptId,
  onSelectTranscript,
}: TranscriptSidebarProps) {
  const { data: transcripts, isLoading, error } = useTranscripts();

  if (isLoading) {
    return (
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h5" component="h2">
            Transcripts
          </Typography>
        </Box>
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
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h5" component="h2">
            Transcripts
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Alert severity="error">Error loading transcripts</Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h5" component="h2">
          Transcripts
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {transcripts && transcripts.length > 0 ? (
          <List>
            {transcripts.map((transcript: Transcript) => (
              <ListItem key={transcript.id} disablePadding>
                <ListItemButton
                  selected={selectedTranscriptId === transcript.id}
                  onClick={() => onSelectTranscript(transcript.id)}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={transcript.title || `Transcript ${transcript.id}`}
                    secondary={new Date(
                      transcript.createdAt
                    ).toLocaleDateString()}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No transcripts available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
