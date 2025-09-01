import UserModel from "@/app/model/User"
import dbConnect from "@/lib/dbConnect"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import mongoose from "mongoose"

export async function GET(request: Request) {
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
  }

  let userId = new mongoose.Types.ObjectId(user._id)

  try {
    let user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ])

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error occure while fetching messages", error)
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
