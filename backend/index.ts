import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dataSource } from "./src/db";
import { OpenAiClient } from "./src/services/ai-service/ai-client";
import { AIService } from "./src/services/ai-service/ai-service";
import { ClinicalTrialService } from "./src/services/clinical-trial-service/clinical-trial-service";
import { TranscriptProcessService } from "./src/services/transcript-process-service";
import { TranscriptService } from "./src/services/transcript-service";
import { TranscriptController } from "./src/controllers/transcript.controller";

dotenv.config();

// Initialize data source
dataSource.initialize();

// Initialize services
const openAiClient = new OpenAiClient();
const transcriptService = new TranscriptService();
const aiService = new AIService(openAiClient);
const clinicalTrialService = new ClinicalTrialService();
const transcriptProcessService = new TranscriptProcessService(
  transcriptService,
  aiService,
  clinicalTrialService
);

// Initialize controller
const transcriptController = new TranscriptController(
  transcriptService,
  transcriptProcessService
);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Transcript routes
app.get("/api/transcripts", transcriptController.getAllTranscripts);
app.get(
  "/api/transcripts/:id/messages",
  transcriptController.getMessagesByTranscriptId
);
app.post(
  "/api/transcripts/:id/process",
  transcriptController.processTranscript
);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
