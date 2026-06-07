import Heading from "@/src/shared/components/typography/Heading";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-10 text-center">
      <Heading>Perfil no encontrado</Heading>
      <Link href={"/"}>Tal vez quieras ir al inicio</Link>
    </div>
  );
}

