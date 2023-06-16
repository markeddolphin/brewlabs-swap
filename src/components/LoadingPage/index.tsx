import { useEffect, useState } from "react";

const LoadingPage = () => {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[rgba(255,0,0,0.5)] z-1000">
      Loading
    </div>
  );
};

export default LoadingPage;
