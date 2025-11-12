import { dataSource } from "./db";
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
  dataSource.initialize();
  const result = await transcriptProcessService.processTranscript(
    "3e943dd5-5a59-47b1-96d6-58ca23eefa78"
  );
  console.log(result);
}

run().catch(console.error);
