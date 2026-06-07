"use client";

import { Form, FormSubmit } from "@/src/shared/components/forms";
import MeetiForm from "./MeetiForm";
import { useSession } from "@/src/lib/auth-client";
import {
  MeetiFormInput,
  MeetiInput,
  MeetiSchema,
} from "../schemas/meetiSchema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMeetiAction } from "../actions/meeti-acations";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

export default function CreateMeeti() {
  const methods = useForm<MeetiFormInput, unknown, MeetiInput>({
    resolver: zodResolver(MeetiSchema),
    mode: "all",
    defaultValues: {
      title: "",
      details: "",
      categoryId: "",
      communityId: "",
      availableSeats: 0,
      date: "",
      time: "",
      image: "",
      virtual: false,
      location: {
        placeName: "",
        address: "",
        city: "",
        country: "",
        lat: -34.60362,
        lng: -58.380369,
      },
    },
  });

  const { isPending } = useSession();
  if (isPending) return "Cargando...";

  const onSubmit = async (data: MeetiInput) => {
    const { error, success } = await createMeetiAction(data);
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
      redirect("/dashboard/meetis");
    }
  };
  return (
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <MeetiForm />
        <FormSubmit value={"Crear Meeti"} />
      </Form>
    </FormProvider>
  );
}

