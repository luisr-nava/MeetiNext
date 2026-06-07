"use client";
import { Form } from "@/src/shared/components/forms";
import FormSubmit from "../../../shared/components/forms/FormSubmit";
import CommunityForm from "./CommunityForm";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommunityInput, CommunitySchema } from "../schema/communitySchema";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { createCommunityAction } from "../actions/community-actions";

export default function CreateCommunity() {
  const methods = useForm({
    resolver: zodResolver(CommunitySchema),
    mode: "all",
    defaultValues: {
      name: "",
      description: "",
      image: ""
    },
  });
  const onSubmit = async (data: CommunityInput) => {
    const { error, success } = await createCommunityAction(data);
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
        <FormSubmit value={"Crear Comunidad"} />
      </Form>
    </FormProvider>
  );
}

