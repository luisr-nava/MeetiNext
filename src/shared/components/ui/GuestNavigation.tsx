import Link from "next/link";
import AILink from "./AILink";

export default function GuestNavigation() {
  return (
    <nav className="flex justify-center items-center gap-4 mt-5 md:mt-0">
      <AILink />
      <Link className="font-bold text-sm" href="/auth/login">
        Iniciar Sesión
      </Link>
      <Link
        className=" font-bold text-sm bg-pink-600 p-2  text-white "
        href="/auth/create-account">
        Registrarse
      </Link>
    </nav>
  );
}

