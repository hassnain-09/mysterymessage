import mongoose from "mongoose"

type ConnectionObject = {
  isConnect?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
  if (connection.isConnect) {
    console.log("Database already connected")
    return
  }

  try {
    const db = await mongoose.connect(process.env.MONGOOSE_URI || "", {})
    console.log("db", db)

    connection.isConnect = db.connections[0].readyState

    console.log("db connected successfully")
  } catch (error) {
    console.log("Database failed to connect", error)
    process.exit(1)
  }
}

export default dbConnect
