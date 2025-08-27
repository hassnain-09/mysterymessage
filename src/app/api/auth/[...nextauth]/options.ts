import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/app/model/User"

export const authOptions: NextAuthOptions = {
  providers: [
    // 🔹 Custom email + password login
    CredentialsProvider({
      id: "Credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect()

        const user = await UserModel.findOne({
          $or: [
            { email: credentials?.email },
            { username: credentials?.username },
          ],
        })
        if (!user) {
          throw new Error("No user found with this email")
        }
        if (!user.isVerified) {
          throw new Error("Please verify your account")
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password,
          user.password
        )

        if (!isPasswordCorrect) {
          throw new Error("Invalid password")
        }

        // Success → return user object (without password)
        return user
      },
    }),

    // 🔹 Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // 🔹 JWT + Session handling
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAcceptingMessages = user.isAcceptingMessages
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id
        session.user.isVerified = token.isVerified
        session.user.isAcceptingMessages = token.isAcceptingMessages
        session.user.username = token.username
      }
      return session
    },
  },
  pages: {
    signIn: "/sign-in", // custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
}
