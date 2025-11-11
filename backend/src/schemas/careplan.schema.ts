import { z } from "zod";
import { CodeableConceptSchema, PeriodSchema } from "./condition.schema";
import { GoalSchema } from "./goal.schema";
import { MedicationRequestSchema } from "./medication-request.schema";

// CarePlan schema following HL7 FHIR R4 specification
export const CarePlanSchema = z.object({
  status: z.enum([
    "draft",
    "active",
    "on-hold",
    "revoked",
    "completed",
    "entered-in-error",
    "unknown",
  ]), // Required in FHIR R4
  intent: z.enum(["proposal", "plan", "order", "option"]), // Required in FHIR R4
  title: z.string().optional().nullable(),
  category: z.array(CodeableConceptSchema).optional().nullable(),
  description: z.string().optional().nullable(),
  goal: z.array(GoalSchema).optional().nullable(), // Array of references to Goal resources
  medication: z.array(MedicationRequestSchema).optional().nullable(),
  period: PeriodSchema.optional().nullable(),
  created: z.string().optional().nullable(), // ISO date-time string

  //   note: z
  //     .array(
  //       z.object({
  //         authorString: z.string().optional(),
  //         time: z.string().optional(), // ISO date-time string
  //         text: z.string().optional(),
  //       })
  //     )
  //     .optional(),
});

export type CarePlan = z.infer<typeof CarePlanSchema>;
