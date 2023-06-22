const StyledInput = ({
  value,
  setValue,
  className,
  placeholder,
}: {
  value: any;
  setValue: any;
  className?: string;
  placeholder?: string;
}) => (
  <input
    type={"text"}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    className={`${className} primary-shadow focusShadow h-10 rounded border-none bg-[#B9B8B81A] p-[16px_14px] text-sm text-white outline-none`}
    placeholder={placeholder}
  />
);

export default StyledInput;
