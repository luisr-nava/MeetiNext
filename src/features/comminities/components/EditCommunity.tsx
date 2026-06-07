"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { CommunityInput, CommunitySchema } from "../schema/communitySchema";
import { Form, FormSubmit } from "@/src/shared/components/forms";
import CommunityForm from "./CommunityForm";
import { SelectCommunity } from "../types/community.types";
import { editCommunityAction } from "../actions/community-actions";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = {
  community: SelectCommunity;
};
export default function EditCommunity({ community }: Props) {
  const methods = useForm({
    resolver: zodResolver(CommunitySchema),
    mode: "all",
    defaultValues: {
      name: community.name,
      description: community.description,
      image: community.image,
    },
  });

  const onSubmit = async (data: CommunityInput) => {
    const { success, error } = await editCommunityAction(data, community.id);
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
      redirect("/dashboard/communities");
    }
  };
  return (
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSubmit)}>
        <CommunityForm />
        <FormSubmit value={"Guardar cambios"} />
      </Form>
    </FormProvider>
  );
}

