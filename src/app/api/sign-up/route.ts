import UserModel from "@/app/model/User"
import { sendVerificationEmail } from "@/helpers/sendEmailVerification"
import dbConnect from "@/lib/dbConnect"
import bcrypt from "bcryptjs"
import { success } from "zod"

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect()

  try {
    // Extract user input from request body
    const { username, email, password } = await request.json()

    // Check if a user already exists with the same username AND is verified
    const existingUserVerifiedByOTP = await UserModel.findOne({
      username,
      isVerified: true,
    })

    // If username is taken by a verified user → reject request
    if (existingUserVerifiedByOTP) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 400 }
      )
    }

    // Check if a user exists with the same email (verified or not)
    const exisitingUserByEmail = await UserModel.findOne({ email })

    // Generate a 5-digit random verification code (OTP)
    const verifyCode = Math.floor(10000 + Math.random() * 90000).toString()

    if (exisitingUserByEmail) {
      // Case 1: User already exists with this email
      if (exisitingUserByEmail.isVerified) {
        // If email is already verified → reject request
        return Response.json(
          { success: false, message: "Already registered with this email" },
          { status: 500 }
        )
      } else {
        // If email exists but not verified → update password & verification code
        const hashPassword = await bcrypt.hash(password, 10)
        exisitingUserByEmail.password = hashPassword
        exisitingUserByEmail.verifyCode = verifyCode
        // Set OTP expiry to 1 hour from now
        exisitingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

        // Save updated unverified user
        await exisitingUserByEmail.save()
      }
    } else {
      // Case 2: New user (email does not exist)

      // Hash the password for security
      const hashPassword = await bcrypt.hash(password, 10)

      //   Setting expiry for OTP to 1 hour
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 1)

      // Create new unverified user with verification code
      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      })

      // Save new user in the database
      await newUser.save()

      // Send verification email with OTP
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      )

      // If email sending failed → reject request
      if (!emailResponse.success) {
        return Response.json(
          { success: false, message: emailResponse.message },
          { status: 500 }
        )
      }

      // Success → user registered but pending email verification
      return Response.json(
        {
          success: true,
          message: "User registered successfully. Please verify you email",
        },
        { status: 201 }
      )
    }
  } catch (error) {
    // Catch any unexpected errors during registration
    console.error("Error registering user", error)

    return Response.json(
      {
        success: false,
        message: "error regestering user",
      },
      {
        status: 500,
      }
    )
  }
}
