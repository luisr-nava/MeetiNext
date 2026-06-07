"use client";

import Heading from "@/src/shared/components/typography/Heading";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="p-10 text-center">
      <Heading>Hubo un errror</Heading>
      <p>{error.message}</p>
    </div>
  );
}

