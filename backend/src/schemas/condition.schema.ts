import { z } from "zod";

// CodeableConcept schema for FHIR coding structures
export const CodeableConceptSchema = z.object({
  coding: z
    .array(
      z.object({
        system: z.string().optional().nullable(),
        code: z.string().optional().nullable(),
        display: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable(),
  text: z.string().optional().nullable(),
});

// Period schema for date ranges
export const PeriodSchema = z.object({
  start: z.string().optional().nullable(), // ISO date string
  end: z.string().optional().nullable(), // ISO date string
});

// Condition schema following HL7 FHIR R4 specification
export const ConditionSchema = z.object({
  clinicalStatus: CodeableConceptSchema, // Required in FHIR R4
  verificationStatus: CodeableConceptSchema.optional().nullable(),
  category: z.array(CodeableConceptSchema).optional().nullable(),
  severity: CodeableConceptSchema.optional().nullable(),
  code: CodeableConceptSchema, // Required - the condition itself
  bodySite: z.array(CodeableConceptSchema).optional().nullable(),
  onsetDateTime: z.string().optional().nullable(), // ISO date-time string
  abatementDateTime: z.string().optional().nullable(), // ISO date-time string
  recordedDate: z.string().optional().nullable(), // ISO date-time string
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

export type Condition = z.infer<typeof ConditionSchema>;
export type CodeableConcept = z.infer<typeof CodeableConceptSchema>;
export type Period = z.infer<typeof PeriodSchema>;
