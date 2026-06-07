"use client";

import { useState } from "react";
import { CommunityPermissions } from "../types/community.types";
import { toogleMembershipAction } from "../actions/membership-actions";
import toast from "react-hot-toast";

type Props = {
  permissions: CommunityPermissions;
  communityId: string;
};
export default function CommunityMembership({
  permissions,
  communityId,
}: Props) {
  const [canJoin, setCanJoin] = useState(permissions.canJoin);

  const handleClick = async () => {
    const result = await toogleMembershipAction(communityId);
    if (result?.success) {
      toast.success(result.message);
      setCanJoin(result.newPermissions.canJoin);
    }
  };
  return (
    <>
      <button
        className={`font-bold text-lg w-full lg:w-auto px-5 py-2 text-white cursor-pointer ${canJoin ? "bg-orange-600" : "bg-red-600"}`}
        onClick={handleClick}>
        {canJoin ? "Inscribirme a esta comunidad" : "Abandonar comunidad"}
      </button>
    </>
  );
}

