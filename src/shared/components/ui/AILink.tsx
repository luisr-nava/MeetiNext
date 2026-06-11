import Link from "next/link";

export default function AILink() {
  return (
    <Link href={"/ai"} className="font-bold text-sm">
      Asistente <span className="text-pink-600 font-black">IA</span>
    </Link>
  );
}

