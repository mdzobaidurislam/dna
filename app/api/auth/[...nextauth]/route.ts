import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // অথবা যেখানে authOptions রেখেছেন

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };