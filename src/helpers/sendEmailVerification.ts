import { ApiResponse } from "@/types/ApiResponse"
import { resend } from "@/lib/resend"
import OtpVerificationEmail from "../../emails/VerificationEmail"

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystry Message Verification Code",
      react: OtpVerificationEmail({ username: username, otp: verifyCode }),
    })
    return { success: true, message: "Verification email sent successfully" }
  } catch (error) {
    return { success: false, message: "Failed to send verification email" }
  }
}
