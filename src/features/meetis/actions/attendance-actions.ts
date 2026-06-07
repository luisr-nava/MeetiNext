"use server";

import { requireAuth } from "@/src/lib/auth-server";
import { meetiAttendeesService } from "../services/MeetiAttendeesServices";
import { getClientIp } from "@/src/shared/utils/ip";
import { rateLimit } from "@/src/lib/limiter";
import { getMinutesDiffFromNow } from "@/src/shared/utils/date";

export async function toogleAttendace(meetiId: string, canConfirm: boolean) {
  const ip = await getClientIp();
  const { success, limit, remaining, reset } = await rateLimit.limit(ip);

  if (!success) {
    return {
      success: "",
      error: `Límite alacanzado. Intenta de nuevo en ${getMinutesDiffFromNow(reset)} Minutos`,
      newPermission: {
        canConfirm,
        canCancel: !canConfirm,
      },
    };
  }

  const { session } = await requireAuth();

  if (!session) throw new Error("Usuario no autenticado");

  const result = await meetiAttendeesService.toogleAttendance(
    meetiId,
    session.user,
  );
  return result;
}

