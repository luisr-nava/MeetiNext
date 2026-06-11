import { createAuthClient } from "better-auth/react";

export const { useSession, signOut, revokeSession } = createAuthClient();

