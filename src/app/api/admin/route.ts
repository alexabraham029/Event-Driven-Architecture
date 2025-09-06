import { clerkClient } from "@clerk/nextjs/server";

export async function isAdmin(userId: string) {
  try {
    const user = await clerkClient.users.getUser(userId);
    return user.privateMetadata?.role === "admin";
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}
