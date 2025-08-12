import z from "zod"

export const messageSchema = z.object({
  content: z
    .string()
    .min(2, "message must be at least 2 characters")
    .max(300, "message must not exceeed 300 charcters"),
})
