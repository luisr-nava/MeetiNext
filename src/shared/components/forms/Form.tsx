import { FormHTMLAttributes } from "react";
import clsx from "clsx";
type Props = FormHTMLAttributes<HTMLFormElement>;

export function Form(props: Props) {
  const { className } = props;
  return (
    <form {...props} className={clsx("mt-10 space-y-3", className)}>
      {props.children}
    </form>
  );
}

