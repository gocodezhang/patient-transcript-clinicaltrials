import OpenAI from "openai";
import { IAIClient } from "./ai-client";
import { merge } from "lodash";
import { AnalyzeTranscriptSchema } from "../../schemas";
import { TRANSCRIPT_ANALYZE_PROMPT } from "./system-prompt";

export class AIService {
  constructor(private readonly aiClient: IAIClient) {}
  async analyzeTranscript(transcript: string) {
    const response = await this.aiClient
      .setSystemPrompt(TRANSCRIPT_ANALYZE_PROMPT)
      .setOutPutFormat(AnalyzeTranscriptSchema)
      .createModelResponse(transcript);

    console.log(response.output_text);

    return AnalyzeTranscriptSchema.parse(JSON.parse(response.output_text));
  }
}
