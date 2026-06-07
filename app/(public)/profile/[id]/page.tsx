import Heading from "@/src/shared/components/typography/Heading";
import { generatePageTitle } from "@/src/shared/utils/metadata";
import { Metadata } from "next";
import { profileService } from "../../../../src/features/profile/services/ProfileService";
import { cache } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import CommunityCard from "@/src/features/comminities/components/CommunityCard";
import MeetiCard from "@/src/features/meetis/components/MeetiCard";

const getPofileDetailsCache = cache(async (id: string) => {
  return await profileService.getPofileDetails(id);
});
export async function generateMetadata({
  params,
}: PageProps<"/profile/[id]">): Promise<Metadata> {
  const { id } = await params;
  const profile = await getPofileDetailsCache(id);
  return {
    title: generatePageTitle(`Perfil de: ${profile?.name}`),
    openGraph: {
      title: `Perfil: ${profile?.name}`,
      siteName: "Perfil",
      images: [
        {
          url: profile?.image ?? `${process.env.APP_URL}/default.jpg`,
          width: 1000,
          height: 600,
          alt: `Imagen del Perfil: ${profile?.name}`,
        },
      ],
      locale: "es_ES",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Meeti: ${profile?.name}`,
      description: "Únete a este Meeti",
      images: [profile?.image ?? `${process.env.APP_URL}/default.jpg`],
    },
  };
}

export default async function ProfilePage({
  params,
}: PageProps<"/profile/[id]">) {
  const { id } = await params;
  const profile = await getPofileDetailsCache(id);
  if (!profile) return notFound();
  return (
    <>
      <main className="max-w-7xl mx-auto mt-10 space-y-5 px-5 lg:p-0 ">
        <div className="space-y-7 mt-10">
          <div className="relative size-64 mx-auto aspect-square overflow-hidden rounded-full border border-gray-400">
            <Image
              src={profile?.image ?? "/default.jpg"}
              height={600}
              width={600}
              alt="Imagen Perfil"
              className="object-cover size-64"
              priority
            />
          </div>
          <Heading level={2} className="text-center">
            {profile.name}
          </Heading>

          <p className="text-gray-500 text-center text-lg">{profile.bio}</p>
        </div>
      </main>
      {profile.communities.length && (
        <section className="max-w-7xl mx-auto mt-10 space-y-5 px-5 lg:p-0 ">
          <Heading level={2} className="text-center">
            Comunidades de {profile.name}
          </Heading>
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3 mt-10">
            {profile.communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </section>
      )}
      {profile.meeties.length && (
        <section className="max-w-7xl mx-auto mt-10 space-y-5 px-5 lg:px-0 pb-20">
          <Heading level={2} className="text-center">
            Procimos Meetis Organizados por {profile.name}
          </Heading>
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3 mt-10">
            {profile.meeties.map((meeti) => (
              <MeetiCard key={meeti.id} meeti={meeti} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

