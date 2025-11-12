import {
  CarePlan,
  CodeableConcept,
  Condition,
  Goal,
  Patient,
} from "../schemas";
import { AIService } from "./ai-service/ai-service";
import { ClinicalTrialService } from "./clinical-trial-service/clinical-trial-service";
import { DefaultOperator } from "./clinical-trial-service/utils";
import { TranscriptService } from "./transcript-service";
import { output } from "./ai-service/constant";
import { Message } from "../db";
import logger from "../utils/logger";
import { MedicationRequest } from "../schemas/medication-request.schema";

export class TranscriptProcessService {
  constructor(
    private readonly transcriptService: TranscriptService,
    private readonly aiService: AIService,
    private readonly clinicalTrialService: ClinicalTrialService
  ) {}
  async processTranscript(id: string) {
    const messages = this.transcriptService.getMessagesById(id);
    const analyzed = await this.aiService.analyzeTranscript(
      this.translateMessagesToString(messages)
    );
    logger.info("analyze result:", analyzed);
    const { conditions, patient, carePlans } = analyzed;

    const goals = carePlans.flatMap((cp) => cp.goal || []);
    const medications = carePlans.flatMap((cp) => cp.medication || []);

    const results = await Promise.all([
      this.searchRelevantTrials(conditions, patient, goals, medications),
      this.searchRelevantTrials(conditions, patient, undefined, medications),
      this.searchRelevantTrials(conditions, patient, goals, undefined),
      this.searchRelevantTrials(conditions, patient),
    ]);

    return results.find((r) => r.totalCount! > 0);
  }

  async searchRelevantTrials(
    conditions: Condition[],
    patient: Patient,
    goals?: Goal[],
    medications?: MedicationRequest[]
  ) {
    const conditionTerms = conditions.flatMap((condition) => {
      return this.processCodeableConcept(condition.code);
    });
    const measureTerms =
      goals?.flatMap(
        (g) =>
          g.target?.flatMap((t) => this.processCodeableConcept(t.measure)) || []
      ) || [];

    const treatmentTerms =
      medications?.flatMap((m) => this.processCodeableConcept(m.medication)) ||
      [];

    return this.clinicalTrialService.searchTrials({
      patient: {
        age: patient.age,
        gender: ["other", "unknown"].includes(patient.gender)
          ? "all"
          : (patient.gender as "male" | "female"),
      },
      conditions: {
        includes: conditionTerms.map((t) => ({
          term: t,
          operator: DefaultOperator,
        })),
        excludes: [],
      },
      treatments: {
        includes: treatmentTerms.map((t) => ({
          term: t,
          operator: DefaultOperator,
        })),
        excludes: [],
      },
      outcomeMeasures: {
        includes: measureTerms.map((t) => ({
          term: t,
          operator: DefaultOperator,
        })),
        excludes: [],
      },
    });
  }

  translateMessagesToString(messages: Message[]) {
    const lines = messages.map((m) => {
      const prefix = m.role === "doctor" ? "D:" : "P:";
      return `${prefix} ${m.body}`;
    });

    return lines.join("\n");
  }

  private processCodeableConcept(
    cc: CodeableConcept | undefined | null
  ): string[] {
    const codingTerms = cc?.coding?.filter((v) => v.display);
    if (codingTerms?.length) {
      return codingTerms.map(({ display }) => display as string);
    } else if (cc?.text) {
      return [cc.text];
    } else {
      return [];
    }
  }
}
