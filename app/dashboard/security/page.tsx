import ChangePasswordForm from "@/src/features/auth/components/ChangePasswordForm";
import Heading from "@/src/shared/components/typography/Heading";
import { generatePageTitle } from "@/src/shared/utils/metadata";
import { Metadata } from "next";

const title = "Ajustes y seguridad";
export const metadata: Metadata = {
  title: generatePageTitle(title),
};

export default function SecurityPage() {
  return (
    <>
      <Heading>{title}</Heading>
      <ChangePasswordForm />
    </>
  );
}

