const Notification = ({ count, className }: { count: number; className?: string }) => {
  return count ? (
    <div
      className={`primary-shadow absolute -right-2 -top-1.5 h-fit rounded bg-[#ffde00] px-1.5 py-0.5 font-brand text-[10px] font-bold leading-none text-[#0E2130] ${className}`}
    >
      +{count}
    </div>
  ) : (
    <div></div>
  );
};

export default Notification;
