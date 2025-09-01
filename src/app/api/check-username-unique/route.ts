import UserModel from "@/app/model/User"
import dbConnect from "@/lib/dbConnect"
import { usernameSchema } from "@/schemas/signUpSchema"
import z from "zod"

const usernameQuerySchema = z.object({ username: usernameSchema })

export async function GET(request: Request) {
  await dbConnect()

  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    // ✅ validate with Zod
    const result = usernameQuerySchema.safeParse({ username })
    // console.log("result = ", result)

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || []
      //   console.log("usenameError = ", usernameError)
      return Response.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(", ")
              : "Invalid username",
        },
        { status: 400 }
      )
    } else {
      const { username } = result.data

      // Check if username is taken by a verified user
      const existingUserVerified = await UserModel.findOne({
        username,
        isVerified: true,
      })

      if (existingUserVerified) {
        return Response.json(
          { success: false, message: "Username already taken" },
          { status: 200 }
        )
      } else {
        return Response.json(
          { success: true, message: "Username is available" },
          { status: 200 }
        )
      }
    }
  } catch (error) {
    console.error("Error occure while checking username uniquness", error)
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
