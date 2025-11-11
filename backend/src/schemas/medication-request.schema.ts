import { z } from "zod";
import { CodeableConceptSchema } from "./condition.schema";

export const MedicationRequestSchema = z.object({
  status: z.enum([
    "draft",
    "active",
    "on-hold",
    "ended",
    "stopped",
    "completed",
    "cancelled",
    "entered-in-error",
    "unknown",
  ]),
  statusReason: CodeableConceptSchema.optional().nullable(),
  intent: z.enum([
    "proposal",
    "plan",
    "order",
    "original-order",
    "reflex-order",
    "filler-order",
    "instance-order",
    "option",
  ]),
  category: z.array(CodeableConceptSchema).optional().nullable(),
  priority: z.enum(["routine", "urgent", "asap", "stat"]).optional().nullable(),
  doNotPerform: z.boolean().optional().nullable(),
  medication: CodeableConceptSchema,
  reason: z.array(CodeableConceptSchema).optional().nullable(),
  //   dosageInstruction: z.array(DosageInstructionSchema).optional().nullable(),
  //   dispenseRequest: DispenseRequestSchema.optional().nullable(),
  //   note: z.array(AnnotationSchema).optional().nullable(),
});

export type MedicationRequest = z.infer<typeof MedicationRequestSchema>;
// export type MedicationRequestIdentifier = z.infer<typeof IdentifierSchema>;
// export type MedicationRequestReference = z.infer<typeof ReferenceSchema>;
// export type MedicationRequestDosageInstruction = z.infer<
//   typeof DosageInstructionSchema
// >;
