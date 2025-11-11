import { CarePlan, CodeableConcept, Condition, Patient } from "../schemas";
import { AIService } from "./ai-service/ai-service";
import { ClinicalTrialService } from "./clinical-trial-service/clinical-trial-service";
import { DefaultOperator } from "./clinical-trial-service/utils";
import { TranscriptService } from "./transcript-service";
import { output } from "./ai-service/constant";

export class TranscriptProcessService {
  constructor(
    private readonly transcriptService: TranscriptService,
    private readonly aiService: AIService,
    private readonly clinicalTrialService: ClinicalTrialService
  ) {}
  async processTranscript(_id: string) {
    const input = this.transcriptService.getTranscript(_id);
    const analyzed = await this.aiService.analyzeTranscript(input);
    const { conditions, patient, carePlans } = analyzed;

    this.searchRelevantTrials(patient, conditions, carePlans);
    // to do: save analyzed result to database
  }

  async searchRelevantTrials(
    patient: Patient,
    conditions: Condition[],
    carePlans: CarePlan[]
  ) {
    const conditionTerms = conditions.flatMap((condition) => {
      return this.processCodeableConcept(condition.code);
    });
    const measureTerms = carePlans.flatMap(
      (cp) =>
        cp.goal?.flatMap(
          (g) =>
            g.target?.flatMap((t) => this.processCodeableConcept(t.measure)) ||
            []
        ) || []
    );
    const treatmentTerms = carePlans.flatMap(
      (cp) =>
        cp.medication?.flatMap((m) =>
          this.processCodeableConcept(m.medication)
        ) || []
    );

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
