import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type {
  Transcript,
  Message,
  ClinicalTrialSearchResponse,
} from "../types/api";

const API_BASE_URL = "http://localhost:3000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Fetch all transcripts
export const useTranscripts = () => {
  return useQuery<Transcript[]>({
    queryKey: ["transcripts"],
    queryFn: async () => {
      const response = await apiClient.get<Transcript[]>("/transcripts");
      return response.data;
    },
  });
};

// Fetch messages for a specific transcript
export const useMessages = (transcriptId: string | null) => {
  return useQuery<Message[]>({
    queryKey: ["messages", transcriptId],
    queryFn: async () => {
      const response = await apiClient.get<Message[]>(
        `/transcripts/${transcriptId}/messages`
      );
      return response.data;
    },
    enabled: !!transcriptId,
  });
};

// Process transcript and get clinical trials
export const useProcessTranscript = () => {
  const queryClient = useQueryClient();

  return useMutation<ClinicalTrialSearchResponse, Error, string>({
    mutationFn: async (transcriptId: string) => {
      const response = await apiClient.post<ClinicalTrialSearchResponse>(
        `/transcripts/${transcriptId}/process`
      );
      return response.data;
    },
    onSuccess: (data, transcriptId) => {
      // Cache the clinical trials result
      queryClient.setQueryData(["clinicalTrials", transcriptId], data);
    },
  });
};

// Get clinical trials for a transcript (from cache)
// Note: Clinical trials are populated via the processTranscript mutation
export const useClinicalTrials = (transcriptId: string | null) => {
  return useQuery<ClinicalTrialSearchResponse | undefined>({
    queryKey: ["clinicalTrials", transcriptId],
    queryFn: async () => {
      // This query is only used to read from cache
      // The actual data is set by the processTranscript mutation
      // Return undefined so it reads from cache
      return undefined;
    },
    enabled: !!transcriptId, // Enable to subscribe to cache updates
    staleTime: Infinity, // Data never goes stale since it's set by mutation
    gcTime: Infinity, // Keep in cache indefinitely
  });
};
