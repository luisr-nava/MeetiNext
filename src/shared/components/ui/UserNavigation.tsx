import Link from "next/link";

export default function UserNavigation() {
  return (
    <nav className="flex justify-center items-center mt-5 md:mt-0">
      <Link
        href={`/dashboard`}
        target="_blank"
        className="font-bold text-sm bg-pink-600 text-white p-2 block w-full text-center">
        Panel de Administración
      </Link>
    </nav>
  );
}

