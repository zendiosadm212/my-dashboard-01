import { z } from "zod"

export const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string().optional().default(""),
  gender: z.string(),
  occupation: z.string().optional().default(""),
  notes: z.string().optional().default(""),
})

export type Customer = z.infer<typeof customerSchema>
