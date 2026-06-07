import {
  FormError,
  FormLabel,
  FormSelect,
} from "@/src/shared/components/forms";
import { Suspense, use } from "react";
import { SelectCategory } from "../types/meeti.type";
import { useFormContext } from "react-hook-form";
import { MeetiInput } from "../schemas/meetiSchema";

const CategoriesPromise = fetch("/api/categories")
  .then((res) => res.json())
  .catch(() => []);

function CategoryOptions() {
  const {
    register,
    formState: { errors },
  } = useFormContext<MeetiInput>();
  const categories = use<SelectCategory[]>(CategoriesPromise);
  return (
    <>
      <FormLabel>Categoría meeti</FormLabel>
      <FormSelect {...register("categoryId")}>
        <option value="">Selecciona Categoría</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </FormSelect>
      {errors.categoryId && <FormError>{errors.categoryId.message}</FormError>}
    </>
  );
}

export default function CategoryFormField() {
  return (
    <Suspense fallback={"Cargando...."}>
      <CategoryOptions />
    </Suspense>
  );
}

