import { OpenAiClient } from "./services/ai-service/ai-client";
import { AIService } from "./services/ai-service/ai-service";
import { ClinicalTrialService } from "./services/clinical-trial-service/clinical-trial-service";
import { TranscriptProcessService } from "./services/transcript-process-service";
import { TranscriptService } from "./services/transcript-service";

const openAiClient = new OpenAiClient();

const transcriptProcessService = new TranscriptProcessService(
  new TranscriptService(),
  new AIService(openAiClient),
  new ClinicalTrialService()
);

async function run() {
  const result = await transcriptProcessService.processTranscript("foo");
  console.log(result);
}

run().catch(console.error);
