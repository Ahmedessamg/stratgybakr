import type { SVGProps } from "react";
import { memo } from "react";
const SvgMessage = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 19 20"
    {...props}
  >
    <path
      fill="#9F9F9F"
      d="M15.046.833H7.492a3.575 3.575 0 0 0-3.575 3.575V4.5h7.59a3.575 3.575 0 0 1 3.576 3.575v5.353a3.566 3.566 0 0 0 3.584-3.584V4.39A3.583 3.583 0 0 0 15.046.833"
    />
    <path
      fill="#9F9F9F"
      d="M11.507 4.5H4A3.584 3.584 0 0 0 .425 8.075v5.454A3.584 3.584 0 0 0 4 17.086h1.118a.98.98 0 0 1 .825.43l.807 1.165a1.173 1.173 0 0 0 1.925 0l.825-1.164a.98.98 0 0 1 .825-.431h1.164a3.575 3.575 0 0 0 3.575-3.575V8.057A3.575 3.575 0 0 0 11.507 4.5"
      opacity={0.3}
    />
    <path
      fill="#9F9F9F"
      d="M4.532 11.76a.862.862 0 1 0 0-1.724.862.862 0 0 0 0 1.723M7.74 11.76a.862.862 0 1 0 0-1.724.862.862 0 0 0 0 1.723M10.939 11.76a.862.862 0 1 0 0-1.724.862.862 0 0 0 0 1.723"
    />
  </svg>
);
const Memo = memo(SvgMessage);
export default Memo;
