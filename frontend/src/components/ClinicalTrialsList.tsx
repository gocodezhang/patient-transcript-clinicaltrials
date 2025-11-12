import { useClinicalTrials } from "../api/transcriptApi";
import type { ClinicalTrial, ClinicalTrialSearchResponse } from "../types/api";
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Link,
} from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";

interface ClinicalTrialsListProps {
  transcriptId: string | null;
  processTranscriptState: UseMutationResult<
    ClinicalTrialSearchResponse,
    Error,
    string,
    unknown
  >;
}

const CLINICAL_TRIAL_BASE_URL = "https://clinicaltrials.gov/";

export function ClinicalTrialsList({
  transcriptId,
  processTranscriptState,
}: ClinicalTrialsListProps) {
  const { data: clinicalTrialsData } = useClinicalTrials(transcriptId);

  // Get clinical trials from query data
  const trialsData = clinicalTrialsData || null;

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
          Select a transcript to view clinical trials
        </Typography>
      </Box>
    );
  }

  const hasTrials =
    trialsData && trialsData.studies && trialsData.studies.length > 0;
  const isLoading = processTranscriptState.isPending;
  console.log(isLoading);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {processTranscriptState.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error processing transcript:{" "}
            {processTranscriptState.error?.message || "Unknown error"}
          </Alert>
        )}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Processing transcript and searching for clinical trials...
            </Typography>
          </Box>
        )}
        {!isLoading && !hasTrials && !processTranscriptState.isError && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Click "Find Clinical Trials" to search for relevant trials
            </Typography>
          </Box>
        )}
        {hasTrials && (
          <Stack spacing={3}>
            <Typography variant="subtitle1" color="text.secondary">
              Found {trialsData?.totalCount || trialsData?.studies.length || 0}{" "}
              clinical trial(s)
            </Typography>
            {trialsData.studies.map((trial: ClinicalTrial) => (
              <Paper key={trial.nctId} elevation={2} sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {trial.briefTitle ||
                      trial.officialTitle ||
                      "Untitled Trial"}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={`NCT ID: ${trial.nctId}`}
                      size="small"
                      variant="outlined"
                    />
                    <Link
                      href={`${CLINICAL_TRIAL_BASE_URL}study/${trial.nctId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      Learn more
                    </Link>
                  </Box>
                </Box>
                {trial.officialTitle &&
                  trial.officialTitle !== trial.briefTitle && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {trial.officialTitle}
                    </Typography>
                  )}
                <Stack spacing={2}>
                  {trial.status && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Status:
                      </Typography>
                      <Typography variant="body2">{trial.status}</Typography>
                    </Box>
                  )}
                  {trial.phase && trial.phase.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Phase:
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {trial.phase.map((phase, idx) => (
                          <Chip key={idx} label={phase} size="small" />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {trial.studyType && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Study Type:
                      </Typography>
                      <Typography variant="body2">{trial.studyType}</Typography>
                    </Box>
                  )}
                  {trial.conditions && trial.conditions.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Conditions:
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {trial.conditions.map((condition, idx) => (
                          <Chip
                            key={idx}
                            label={condition}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {trial.interventions && trial.interventions.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Interventions:
                      </Typography>
                      <Stack spacing={1}>
                        {trial.interventions.map((intervention, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            {intervention.name && (
                              <Typography variant="body2">
                                {intervention.name}
                              </Typography>
                            )}
                            {intervention.type && (
                              <Chip
                                label={intervention.type}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
                  {trial.eligibility && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Eligibility:
                      </Typography>
                      <Stack direction="row" spacing={2} flexWrap="wrap">
                        {trial.eligibility.gender && (
                          <Typography variant="body2">
                            Gender: {trial.eligibility.gender}
                          </Typography>
                        )}
                        {(trial.eligibility.minimumAge ||
                          trial.eligibility.maximumAge) && (
                          <Typography variant="body2">
                            Age: {trial.eligibility.minimumAge || "N/A"} -{" "}
                            {trial.eligibility.maximumAge || "N/A"}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  )}
                  {trial.locations && trial.locations.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Locations:
                      </Typography>
                      <Stack spacing={1}>
                        {trial.locations.map((location, idx) => (
                          <Box key={idx}>
                            {location.facility && (
                              <Typography variant="body2" fontWeight="medium">
                                {location.facility}
                              </Typography>
                            )}
                            <Typography variant="body2" color="text.secondary">
                              {[location.city, location.state, location.country]
                                .filter((loc) => !!loc)
                                .join(", ")}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
