import Link from "next/link";
import AILink from "./AILink";

export default function UserNavigation() {
  return (
    <nav className="flex justify-center items-center mt-5 md:mt-0 gap-5">
      <AILink />
      <Link
        href={`/dashboard`}
        target="_blank"
        className="font-bold text-sm bg-pink-600 text-white p-2 block w-full text-center">
        Panel de Administración
      </Link>
    </nav>
  );
}

