import { Request, Response } from "express";
import { TranscriptService } from "../services/transcript-service";
import { TranscriptProcessService } from "../services/transcript-process-service";

export class TranscriptController {
  constructor(
    private readonly transcriptService: TranscriptService,
    private readonly transcriptProcessService: TranscriptProcessService
  ) {}

  getAllTranscripts = async (req: Request, res: Response): Promise<void> => {
    try {
      const transcripts = this.transcriptService.getTranscripts();
      res.json(transcripts);
    } catch (error) {
      console.error("Error getting all transcripts:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getMessagesByTranscriptId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: "Transcript ID is required" });
        return;
      }

      const messages = this.transcriptService.getMessagesById(id);

      if (!messages) {
        res
          .status(404)
          .json({ error: "Messages not found for the given transcript ID" });
        return;
      }

      res.json(messages);
    } catch (error) {
      console.error("Error getting messages by transcript ID:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  processTranscript = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: "Transcript ID is required" });
        return;
      }

      const result = await this.transcriptProcessService.processTranscript(id);

      if (!result) {
        res
          .status(404)
          .json({ error: "No clinical trials found for the given transcript" });
        return;
      }

      res.json(result);
    } catch (error) {
      console.error("Error processing transcript:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
