const Waves = () => (
  <div className="waves absolute top-0 h-16 w-full">
    <svg
      className="absolute -top-8 h-8 w-full"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28 "
      preserveAspectRatio="none"
    >
      <defs>
        <path
          id="wave-path"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>

      <g className="wave3">
        <use
          xlinkHref="#wave-path"
          x="50"
          y="9"
          className="fill-slate-50 dark:fill-zinc-900"
        />
      </g>
    </svg>
  </div>
);

export default Waves;
