import { ApiResponse } from "@/types/ApiResponse"
import { resend } from "@/lib/resend"
import OtpVerificationEmail from "../../emails/OtpVerificationEmail"

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystery Message Verification",
      react: OtpVerificationEmail({ username, otp: verifyCode }),
    })

    return { success: true, message: "Verification email sent successfully" }
  } catch (error: any) {
    console.error("Email sending error:", error)
    return {
      success: false,
      message: `Failed to send verification email: ${error.message || error}`,
    }
  }
}
