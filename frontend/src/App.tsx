import { useState } from "react";
import { TranscriptSidebar } from "./components/TranscriptSidebar";
import { MessagesList } from "./components/MessagesList";
import { ClinicalTrialsList } from "./components/ClinicalTrialsList";
import { useProcessTranscript } from "./api/transcriptApi";
import { Box, ToggleButton, ToggleButtonGroup, Button } from "@mui/material";

type ViewMode = "messages" | "trials";

function App() {
  const [selectedTranscriptId, setSelectedTranscriptId] = useState<
    string | null
  >(null);
  const [viewMode, setViewMode] = useState<ViewMode>("messages");
  const processTranscript = useProcessTranscript();

  const handleProcessTranscript = () => {
    if (selectedTranscriptId) {
      processTranscript.mutate(selectedTranscriptId);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      <TranscriptSidebar
        selectedTranscriptId={selectedTranscriptId}
        onSelectTranscript={(id) => {
          setSelectedTranscriptId(id);
        }}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => {
              if (newMode !== null) {
                setViewMode(newMode);
              }
            }}
            aria-label="view mode"
          >
            <ToggleButton value="messages" aria-label="messages">
              Messages
            </ToggleButton>
            <ToggleButton value="trials" aria-label="clinical trials">
              Clinical Trials
            </ToggleButton>
          </ToggleButtonGroup>
          {viewMode === "trials" && (
            <Button
              variant="contained"
              onClick={handleProcessTranscript}
              disabled={processTranscript.isPending || !selectedTranscriptId}
            >
              {processTranscript.isPending
                ? "Processing..."
                : "Find Clinical Trials"}
            </Button>
          )}
        </Box>
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          {viewMode === "messages" ? (
            <MessagesList transcriptId={selectedTranscriptId} />
          ) : (
            <ClinicalTrialsList
              transcriptId={selectedTranscriptId}
              processTranscriptState={processTranscript}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default App;
