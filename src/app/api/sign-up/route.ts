import UserModel from "@/app/model/User"
import { sendVerificationEmail } from "@/helpers/sendEmailVerification"
import dbConnect from "@/lib/dbConnect"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  await dbConnect()

  try {
    const { username, email, password } = await request.json()

    // Check if username is taken by a verified user
    const existingUserVerified = await UserModel.findOne({
      username,
      isVerified: true,
    })

    if (existingUserVerified) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      )
    }

    // Check if a user exists with this email
    let user = await UserModel.findOne({ email })

    // Generate a 5-digit OTP
    const verifyCode = Math.floor(10000 + Math.random() * 90000).toString()
    const expiryDate = new Date(Date.now() + 3600000) // 1 hour expiry

    const hashPassword = await bcrypt.hash(password, 10)

    if (user) {
      // Case: email exists but not verified
      if (user.isVerified) {
        return Response.json(
          { success: false, message: "Already registered with this email" },
          { status: 400 }
        )
      }

      // Update password and verification code for unverified user
      user.password = hashPassword
      user.verifyCode = verifyCode
      user.verifyCodeExpiry = expiryDate
      await user.save()
    } else {
      // Case: new user
      user = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      })
      await user.save()
    }

    // Send verification email in both cases
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    )

    if (!emailResponse.success) {
      console.log("Email not sent successfully")
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      )
    }

    console.log("Email sent successfully")
    return Response.json(
      {
        success: true,
        message: "Verification email sent. Please verify your email.",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error registering user", error)
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    )
  }
}
