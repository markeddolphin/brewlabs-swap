const ProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="w-full rounded-full bg-gray-200 shadow-inner dark:bg-gray-700">
      <div
        className="h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-brand"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
