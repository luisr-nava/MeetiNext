import { Metadata } from "next";
import Hero from "@/components/ui/Hero";
import { generatePageTitle } from "@/src/shared/utils/metadata";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: generatePageTitle("Inicio"),
  description: "Página de inicio",
};
export default async function Home() {


  return (
    <>
      <Hero />
    </>
  );
}

