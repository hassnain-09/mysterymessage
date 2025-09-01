import UserModel, { Message } from "@/app/model/User"
import dbConnect from "@/lib/dbConnect"

export async function POST(request: Request) {
  await dbConnect()

  const { username, content } = await request.json()

  try {
    const user = await UserModel.findOne({ username })
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    if (user.isAcceptingMessages) {
      user.messages.push({ content, createdAt: new Date() } as Message)
      await user.save()
      return Response.json(
        { success: true, message: "Message sent successfully" },
        { status: 200 }
      )
    } else {
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 403 }
      )
    }
  } catch (error) {
    console.error("Error occurred while sending message", error)
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
