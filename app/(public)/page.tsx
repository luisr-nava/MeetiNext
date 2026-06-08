import { Metadata } from "next";
import Hero from "@/components/ui/Hero";
import { generatePageTitle } from "@/src/shared/utils/metadata";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import UpcomingMeetis from "@/src/features/meetis/components/UpcomingMeetis";
import FeaturedCommunities from "@/src/features/comminities/components/FeaturedCommunities";
import CategoryList from "@/src/features/meetis/components/CategoryList";

export const metadata: Metadata = {
  title: generatePageTitle("Inicio"),
  description: "Página de inicio",
};
export default async function Home() {
  return (
    <>
      <Hero />
      <UpcomingMeetis />
      <FeaturedCommunities />
      <CategoryList />
    </>
  );
}

