// NextAuth options type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface NextAuthOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providers: any[]
  session: {
    strategy: 'jwt' | 'database'
  }
  pages?: {
    signIn?: string
    signUp?: string
  }
  callbacks?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt?: (params: any) => any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session?: (params: any) => any
  }
}
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}
