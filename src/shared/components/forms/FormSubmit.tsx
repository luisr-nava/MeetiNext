import { InputHTMLAttributes } from "react";
type Props = InputHTMLAttributes<HTMLInputElement>;

export function FormSubmit(props: Props) {
  return (
    <input
      type="submit"
      {...props}
      className="disabled:opacity-50 bg-pink-600 text-white w-full p-2 uppercase font-black cursor-pointer mt-5"
    />
  );
}

