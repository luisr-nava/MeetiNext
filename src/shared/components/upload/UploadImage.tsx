import { useState } from "react";
import { UploadDropzone } from "../../utils/uploadthing";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { CommunityInput } from "@/src/features/comminities/schema/communitySchema";
import { FormError } from "../forms";
import { MeetiInput } from "@/src/features/meetis/schemas/meetiSchema";
import { ProfileInput } from "@/src/features/profile/schema/profileSchema";

type Props = {
  uploadedImageLabel: string;
};
export default function UploadImage({ uploadedImageLabel }: Props) {
  const {
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
  } = useFormContext<CommunityInput | MeetiInput | ProfileInput>();
  const [uploadedImage, setUploadedImage] = useState("");

  const currentImage = getValues("image") ? getValues("image") : null;

  return (
    <>
      <UploadDropzone
        endpoint={"meetiUploader"}
        className="ut-button:bg-orange-600 hover:ut-button:bg-orange-700"
        onClientUploadComplete={(res) => {
          setUploadedImage(res[0].ufsUrl);
          setValue("image", res[0].ufsUrl);
          clearErrors("image");
        }}
        appearance={{
          button:
            "font-black py-3 w-full block h-auto rounded-none after:bg-orange-500 after:h-2 after:top-0",
          label: "text-sm text-gray-600 hover:text-gray-600",
          allowedContent: "text-sm",
        }}
        content={{
          button: "Selecciona una imagen",
          label: "Elige un Archivo o arrástralo aquí",
          allowedContent: "Máximo 1 Imagen de 1MB",
        }}
        config={{
          cn: twMerge,
          mode: "auto",
        }}
      />
      {errors.image && <FormError>{errors.image.message}</FormError>}

      {uploadedImage && (
        <>
          <p className="text-lg font-bold">{uploadedImageLabel}</p>
          <Image
            src={uploadedImage}
            alt="Imagen publicada"
            width={300}
            height={200}
          />
        </>
      )}

      {currentImage && !uploadedImage && (
        <>
          <p className="text-lg font-bold">Imagen Actual</p>
          <Image
            src={currentImage}
            alt="Imagen publicada"
            width={300}
            height={200}
          />
        </>
      )}
    </>
  );
}

