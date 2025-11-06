import type { SVGProps } from "react";
import { memo } from "react";
const SvgAddCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    overflow="visible"
    preserveAspectRatio="none"
    style={{
      display: "block",
    }}
    viewBox="0 0 15 15"
    width="1em"
    height="1em"
    {...props}
  >
    <g fill="var(--fill-0, #00665E)">
      <path d="M7.5 14.219A6.724 6.724 0 0 1 .781 7.5 6.724 6.724 0 0 1 7.5.781 6.724 6.724 0 0 1 14.219 7.5 6.725 6.725 0 0 1 7.5 14.219m0-12.5A5.79 5.79 0 0 0 1.719 7.5 5.79 5.79 0 0 0 7.5 13.281 5.79 5.79 0 0 0 13.281 7.5 5.79 5.79 0 0 0 7.5 1.719" />
      <path d="M10 7.969H5a.47.47 0 0 1-.469-.469c0-.256.213-.469.469-.469h5c.256 0 .469.213.469.469a.47.47 0 0 1-.469.469" />
      <path d="M7.5 10.469A.47.47 0 0 1 7.031 10V5c0-.256.213-.469.469-.469s.469.213.469.469v5a.47.47 0 0 1-.469.469" />
    </g>
  </svg>
);
const Memo = memo(SvgAddCircle);
export default Memo;
