import type { SVGProps } from "react";
import { memo } from "react";
const SvgNotification = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 5 2"
    {...props}
  >
    <path fill="#9F9F9F" d="M.73.417a1.833 1.833 0 0 0 3.539 0z" />
  </svg>
);
const Memo = memo(SvgNotification);
export default Memo;
