import {
  FormError,
  FormLabel,
  FormSelect,
} from "@/src/shared/components/forms";
import { Suspense, use } from "react";
import { MeetiInput } from "../schemas/meetiSchema";
import { useFormContext } from "react-hook-form";

const communitiesPromise = fetch("/api/user/communities")
  .then((res) => res.json())
  .catch(() => []);

function CommunityOptions() {
  const {
    register,
    formState: { errors },
  } = useFormContext<MeetiInput>();
  const communities = use<{ id: string; name: string }[]>(communitiesPromise);
  return (
    <>
      <FormLabel>Comunidad meeti</FormLabel>
      <FormSelect {...register("communityId")}>
        <option value="">Selecciona Comunidad</option>
        {communities.map((community) => (
          <option key={community.id} value={community.id}>
            {community.name}
          </option>
        ))}
      </FormSelect>
      {errors.communityId && (
        <FormError>{errors.communityId.message}</FormError>
      )}
    </>
  );
}

export default function CommunityFormField() {
  return (
    <Suspense fallback={"Cargando...."}>
      <CommunityOptions />
    </Suspense>
  );
}

