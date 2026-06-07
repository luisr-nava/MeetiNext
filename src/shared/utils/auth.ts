import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const checkPassword = async (password: string) => {
  const user = await auth.api.getSession({
    headers: await headers(),
  });
  const ctx = await auth.$context;

  if (!user) throw new Error("Usuario no autenticado");
  const accounts = await ctx.internalAdapter.findAccounts(user?.session.userId);
  const credentialAccount = accounts?.find(
    (account) => account.providerId === "credential",
  );
  const hash = credentialAccount?.password!;

  return await ctx.password.verify({
    password,
    hash,
  });
};
