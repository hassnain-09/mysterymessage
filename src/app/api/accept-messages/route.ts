import dbConnect from "@/lib/dbConnect"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import UserModel from "@/app/model/User"

export async function POST(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions)

  const user = session?.user
  if (!user || !session) {
    return Response.json(
      {
        success: false,
        message: "Unauthenticated user",
      },
      {
        status: 401,
      }
    )
  } else {
    try {
      const { acceptingMessages } = await request.json()
      const dbUser = await UserModel.findOne({ username: user.username })
      if (!dbUser) {
        return Response.json(
          { success: false, message: "User not found" },
          { status: 404 }
        )
      }

      dbUser.isAcceptingMessages = acceptingMessages
      await dbUser.save()
      return Response.json({ success: true, message: "Settings updated" })
    } catch (error) {
      console.error("Error occure while accepting messages", error)
      return Response.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      )
    }
  }
}

export async function GET() {
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthenticated user" },
      { status: 401 }
    )
  }

  try {
    const dbUser = await UserModel.findOne({ username: session.user.username })

    if (!dbUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      acceptingMessages: dbUser.isAcceptingMessages,
    })
  } catch (error) {
    console.error("Error while fetching acceptingMessages:", error)
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
