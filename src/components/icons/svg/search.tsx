import type { SVGProps } from "react";
import { memo } from "react";
const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 6 6"
    {...props}
  >
    <path
      fill="#9F9F9F"
      d="M5.208 2.802 2.302.052A8.5 8.5 0 0 1 .341 1.885l2.988 2.842a1.366 1.366 0 1 0 1.833-1.999z"
      opacity={0.3}
    />
  </svg>
);
const Memo = memo(SvgSearch);
export default Memo;
