import { escapeRegExp } from '../../utils'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

const NumericalInput = ({
  value,
  onUserInput,
  placeholder,
  decimals = 18,
  disable = false,
}: {
  value: string | number;
  onUserInput: (input: string) => void;
  placeholder?: string;
  error?: boolean;
  fontSize?: string;
  align?: "right" | "left";
  decimals?: number;
  isZap?: boolean;
  disable?: boolean;
}) => {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput)
    }
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      enforcer(e.target.value.replace(/,/g, '.'))
    }
  }

  return (
    <input
      value={value}
      onChange={handleOnChange}
      inputMode="decimal"
      placeholder={placeholder || "0.0"}
      pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
      className="w-full bg-transparent text-4xl outline-0 max-w-[250px] truncate"
      maxLength={79}
      disabled={disable}
    />
  );
};

export default NumericalInput;
