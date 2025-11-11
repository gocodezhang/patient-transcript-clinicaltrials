import z from "zod";
import { PatientSchema } from "./patient.schema";
import { ConditionSchema } from "./condition.schema";
import { CarePlanSchema } from "./careplan.schema";

// Export all schemas from a single entry point
export * from "./patient.schema";
export * from "./condition.schema";
export * from "./careplan.schema";
export * from "./goal.schema";

export const AnalyzeTranscriptSchema = z.object({
  patient: PatientSchema,
  conditions: z.array(ConditionSchema),
  carePlans: z.array(CarePlanSchema),
});
