import CreateMeeti from "@/src/features/meetis/components/CreateMeeti";
import { useSession } from "@/src/lib/auth-client";
import { requireAuth } from "@/src/lib/auth-server";
import Heading from "@/src/shared/components/typography/Heading";
import { generatePageTitle } from "@/src/shared/utils/metadata";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

const title = "Crear Meetis";

export const metadata: Metadata = {
  title: generatePageTitle(title),
};

export default async function CreateMeetiPage() {
  const { session } = await requireAuth();

  if (!session) redirect("/auth/login");
  
  return (
    <>
      <Heading>{title}</Heading>
      <Link
        href="/dashboard/meetis"
        className="mt-5 block lg:inline-block text-center bg-orange-500 hover:bg-orange-600 transition-colors text-xs lg:text-xl text-white py-3 px-10  font-bold">
        Volver a mis meetis
      </Link>
      <CreateMeeti />
    </>
  );
}

