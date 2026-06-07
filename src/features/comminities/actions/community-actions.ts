"use server";

import { requireAuth } from "@/src/lib/auth-server";
import { CommunityInput, CommunitySchema } from "../schema/communitySchema";
import { sessions } from "../../../db/schema/auth";
import { communityService } from "../services/CommunityService";
import {
  CheckPasswordInput,
  CheckPasswordSchema,
} from "../../auth/schemas/authSchema";

export async function createCommunityAction(input: CommunityInput) {
  const data = CommunitySchema.safeParse(input);
  if (!data.success) {
    return {
      error: "Hubo un error",
      success: "",
    };
  }
  const { session } = await requireAuth();
  if (!session) {
    return {
      error: "Hubo un error",
      success: "",
    };
  }

  const response = await communityService.createCommunity(
    data.data,
    session.user.id,
  );

  return {
    error: "",
    success: "Comunidad creada correctamente",
  };
}

export async function editCommunityAction(input: CommunityInput, id: string) {
  const data = CommunitySchema.safeParse(input);
  if (!data.success) {
    return {
      error: "Hubo un error",
      success: "",
    };
  }
  const { session } = await requireAuth();
  if (!session) {
    return {
      error: "Hubo un error",
      success: "",
    };
  }
  await communityService.updateCommunity(data.data, id, session.user);
  return {
    error: "",
    success: "Comunidad Actualizada correctamente",
  };
}

export async function deleteCommunityAction(
  input: CheckPasswordInput,
  id: string,
) {
  const data = CheckPasswordSchema.safeParse(input);
  if (!data.success) {
    return {
      error: "Hubo un error",
      success: "",
    };
  }
  const { session } = await requireAuth();
  if (!session) {
    return {
      error: "Hubo un error",
      success: "",
    };
  }

  const response = await communityService.deleteCommunity(
    id,
    input.password,
    session.user,
  );
  return response;
}

