"use client";

import {
  Form,
  FormError,
  FormInput,
  FormLabel,
  FormSubmit,
} from "@/components/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignInInput, SignInSchema } from "../schemas/authSchema";
import { signInAction } from "../actions/auth-actions";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [locked, setLocked] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(SignInSchema),
    mode: "all",
  });

  const onSubmit = async (data: SignInInput) => {
    if (locked) return;
    setLocked(true);
    const { success, error } = await signInAction(data);
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
      redirect("/dashboard");
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormLabel htmlFor="email">E-mail</FormLabel>
      <FormInput
        type="email"
        id="email"
        placeholder="Ingresa tu E-mail"
        {...register("email")}
      />
      {errors.email && <FormError>{errors.email.message}</FormError>}

      <FormLabel htmlFor="password">Password</FormLabel>
      <FormInput
        type="password"
        id="password"
        placeholder="Ingresa tu contraseña"
        {...register("password")}
      />
      {errors.password && <FormError>{errors.password.message}</FormError>}

      <FormSubmit
        value={isSubmitting ? "Ingresando..." : "Iniciar sesión"}
        disabled={isSubmitting || locked}
      />
    </Form>
  );
}

