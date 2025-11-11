import { z } from "zod";
import { CodeableConceptSchema, PeriodSchema } from "./condition.schema";

// Quantity schema for target detail
const QuantitySchema = z.object({
  value: z.number().optional().nullable(),
  unit: z.string().optional().nullable(),
  system: z.string().optional().nullable(),
  code: z.string().optional().nullable(),
});

// Range schema for target detail
const RangeSchema = z.object({
  low: z
    .object({
      value: z.number().optional().nullable(),
      unit: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  high: z
    .object({
      value: z.number().optional().nullable(),
      unit: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

// Ratio schema for target detail
const RatioSchema = z.object({
  numerator: QuantitySchema.optional().nullable(),
  denominator: QuantitySchema.optional().nullable(),
});

// Goal schema following HL7 FHIR R4 specification
export const GoalSchema = z.object({
  lifecycleStatus: z.enum([
    "proposed",
    "planned",
    "accepted",
    "active",
    "on-hold",
    "completed",
    "cancelled",
    "entered-in-error",
    "rejected",
  ]), // Required in FHIR R4
  //   achievementStatus: CodeableConceptSchema.optional(),
  category: z.array(CodeableConceptSchema).optional().nullable(),
  continuous: z.boolean().optional().nullable(),
  priority: z
    .enum(["high-priority", "medium-priority", "low-priority"])
    .optional()
    .nullable(),
  description: z.string().optional().nullable(),
  //   subject: z.string().optional(), // Reference to Patient (simplified as string)
  //   startDate: z.string().optional(), // ISO date string
  //   startCodeableConcept: CodeableConceptSchema.optional(),
  //   acceptance: z
  //     .array(
  //       z.object({
  //         participant: z.string().optional(), // Reference (simplified as string)
  //         status: z.enum(["agree", "disagree", "pending"]).optional(),
  //         priority: CodeableConceptSchema.optional(),
  //       })
  //     )
  //     .optional(),
  target: z
    .array(
      z.object({
        measure: CodeableConceptSchema.optional().nullable(),
        // detailQuantity: QuantitySchema.optional(),
        // detailRange: RangeSchema.optional(),
        // detailCodeableConcept: CodeableConceptSchema.optional(),
        // detailString: z.string().optional(),
        // detailBoolean: z.boolean().optional(),
        // detailInteger: z.number().int().optional(),
        // detailRatio: RatioSchema.optional(),
        // dueDate: z.string().optional(), // ISO date string
        // dueDuration: z
        //   .object({
        //     value: z.number().optional(),
        //     unit: z.string().optional(),
        //     system: z.string().optional(),
        //     code: z.string().optional(),
        //   })
        //   .optional(),
      })
    )
    .optional()
    .nullable(),
  //   statusDate: z.string().optional(), // ISO date string
  //   statusReason: z.array(CodeableConceptSchema).optional(),
});

export type Goal = z.infer<typeof GoalSchema>;
export type Quantity = z.infer<typeof QuantitySchema>;
export type Range = z.infer<typeof RangeSchema>;
export type Ratio = z.infer<typeof RatioSchema>;
