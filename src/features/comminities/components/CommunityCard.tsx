import Image from "next/image";
import { SelectCommunity } from "../types/community.types";
import Heading from "@/src/shared/components/typography/Heading";
import Link from "next/link";
import { pluraliza } from "@/src/shared/utils/strigs";

type Props = {
  community: Omit<SelectCommunity, "createdBy" | "createdAt"> & {
    membersCount?: string;
  };
};

export default function CommunityCard({ community }: Props) {
  return (
    <div className="border border-slate-200 bg-white hover:shadow-lg transition-shadow">
      <div className="overflow-hidden">
        <Image
          src={community.image}
          width={600}
          height={600}
          alt={`Imagen de Comunidad ${community.name}`}
          className="object-cover h-60 w-full transition-transform duration-300 ease-in-out hover:scale-120"
        />
      </div>
      <div className="p-5 space-y-3">
        <Heading level={3} className="font-bold text-2xl line-clamp-1">
          {community.name}
        </Heading>
        {community.membersCount && (
          <p className="text-gray-600 text-sm">
            {community.membersCount}{" "}
            {pluraliza("Miembro", +community.membersCount)}
          </p>
        )}
        <p className="line-clamp-2">{community.description}</p>
        <Link
          href={`/communities/${community.id}`}
          className="bg-orange-500 hover:bg-orange-600 transition-colors text-xl text-white py-3 px-10 mt-10 font-bold block text-center">
          Ver Comunidad
        </Link>
      </div>
    </div>
  );
}

