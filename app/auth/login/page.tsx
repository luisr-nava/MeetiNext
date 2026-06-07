import Heading from "@/components/typography/Heading";
import LoginForm from "@/src/features/auth/components/LoginForm";
import { generatePageTitle } from "@/src/shared/utils/metadata";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: generatePageTitle("Iniciar Sesión"),
};

export default function LoginPage() {
  return (
    <>
      <Heading>Iniciar Sesión</Heading>
      <LoginForm />
      <nav className="mt-20 flex justify-between">
        <Link href="/auth/create-account" className="font-bold">
          Crear Cuenta
        </Link>
        <Link href="/auth/forgot-password" className="font-bold">
          Olvide mi Contraseña
        </Link>
      </nav>
    </>
  );
}

