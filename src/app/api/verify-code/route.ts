import UserModel from "@/app/model/User"
import dbConnect from "@/lib/dbConnect"

export async function POST(request: Request) {
  const { username, code } = await request.json()
  await dbConnect()

  try {
    const user = await UserModel.findOne({
      username: username,
      verifyCode: code,
    })
    if (!user) {
      return Response.json({
        success: false,
        message: "No user found with this username and code",
      })
    }

    const isCodeExpired = user?.verifyCodeExpiry > new Date()
    const codeCorrect = user?.verifyCode === code
    const isAlreadyVerified = user?.isVerified
    const canVerify = codeCorrect && isCodeExpired && !isAlreadyVerified

    if (!canVerify) {
      let message = "Cannot verify. "
      if (isAlreadyVerified) {
        message += "User is already verified."
      } else if (!codeCorrect) {
        message += "Verification code is incorrect."
      } else if (!isCodeExpired) {
        message += "Verification code has expired.Please signup again"
      }
      return Response.json({ success: false, message })
    }

    user.isVerified = true
    await user.save()

    return Response.json({
      success: true,
      message: "User verified successfully",
    })
  } catch (error) {
    console.error("error verifying code", error)
    return Response.json(
      {
        success: false,
        message: "error verifying code",
      },
      { status: 500 }
    )
  }
}
