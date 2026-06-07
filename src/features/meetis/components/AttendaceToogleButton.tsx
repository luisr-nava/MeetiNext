"use client";
import { useState } from "react";
import { MeetiPermissions } from "../types/meeti.type";
import { toogleAttendace } from "../actions/attendance-actions";
import toast from "react-hot-toast";

type Props = {
  meetiId: string;
  permissions: MeetiPermissions;
};
export default function AttendaceToogleButton({ meetiId, permissions }: Props) {
  const [canConfirm, setCanConfirm] = useState(permissions.canConfirm);

  const handleClick = async () => {
    const result = await toogleAttendace(meetiId, canConfirm);

    if (result?.error) {
      toast.error(result.error);
    }
    if (result?.success) {
      toast.success(result.success);
      setCanConfirm(result?.newPermission.canConfirm);
    }
  };

  return (
    <button
      className={`font-bold text-lg w-full lg:w-auto px-5 py-2 text-white cursor-pointer ${canConfirm ? "bg-orange-600" : "bg-red-600"}`}
      onClick={handleClick}>
      {canConfirm ? "Confirmar Asistencia" : "Cancelar Asistencia"}
    </button>
  );
}

