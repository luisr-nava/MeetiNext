import { LabelHTMLAttributes } from "react";
type Props = LabelHTMLAttributes<HTMLLabelElement>;

export function FormLabel(props: Props) {
  return (
    <label {...props} className="block">
      {props.children}
    </label>
  );
}

