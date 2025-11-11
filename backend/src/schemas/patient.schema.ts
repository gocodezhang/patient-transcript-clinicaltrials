import { z } from "zod";

// HumanName schema for FHIR name structure
// export const HumanNameSchema = z.object({
//   use: z
//     .enum([
//       "usual",
//       "official",
//       "temp",
//       "nickname",
//       "anonymous",
//       "old",
//       "maiden",
//     ])
//     .optional()
//     .nullable(),
//   text: z.string().optional().nullable(),
//   family: z.string().optional().nullable(),
//   given: z.array(z.string()).optional().nullable(),
//   prefix: z.array(z.string()).optional().nullable(),
//   suffix: z.array(z.string()).optional().nullable(),
//   period: z
//     .object({
//       start: z.string().optional().nullable(),
//       end: z.string().optional().nullable(),
//     })
//     .optional()
//     .nullable(),
// });

// Patient schema with name, age, and gender
export const PatientSchema = z.object({
  name: z.string(), // Simple string name
  age: z.number().int().min(0).max(150),
  gender: z.enum(["male", "female", "other", "unknown"]),
  birthDate: z.string().optional().nullable(), // ISO date string (YYYY-MM-DD)
});

export type Patient = z.infer<typeof PatientSchema>;
// export type HumanName = z.infer<typeof HumanNameSchema>;
