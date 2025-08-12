import z from "zod"

export const signUpSchema = z.object({
  username: z
    .string()
    .min(2, "usename must be atleast 2 characters")
    .max(20, "username must not be more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "usename must not contain special characters"),

  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
})
