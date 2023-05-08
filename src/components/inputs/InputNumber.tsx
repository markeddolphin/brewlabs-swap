import { InputHTMLAttributes, ReactElement } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value?: string;
  placeholder?: string;
}

const Input = (props: InputProps): ReactElement => {
  const { value, placeholder } = props;

  return (
    <input
      type="number"
      autoComplete="off"
      value={value}
      min="0"
      placeholder={placeholder}
      {...props}
      className="block w-full rounded-md border border-gray-300 py-2 pl-24 pr-16 text-black focus:border-amber-300 focus:ring-amber-300 dark:bg-zinc-800 dark:text-white sm:text-sm"
    />
  );
};

export default Input;
