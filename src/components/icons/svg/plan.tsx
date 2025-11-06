import type { SVGProps } from "react";
import { memo } from "react";
const SvgPlan = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 26 27"
    {...props}
  >
    <g
      stroke="#50CD89"
      strokeLinejoin="round"
      strokeWidth={1.083}
      clipPath="url(#plan_svg__a)"
    >
      <path d="M.542 23.792V5.376a2.167 2.167 0 0 1 2.166-2.167h1.625v18.417H2.802a2.23 2.23 0 0 0-2.25 1.953 2.166 2.166 0 0 0 2.156 2.38H22.75a1.084 1.084 0 0 0 1.083-1.083V6.459a1.084 1.084 0 0 0-1.083-1.083" />
      <path d="M25.128 1.374a1.13 1.13 0 0 1 0 1.598l-8.79 8.79-1.598-1.599 8.79-8.789a1.13 1.13 0 0 1 1.598 0Z" />
      <path d="m16.339 11.76-2.797 1.2 1.199-2.797m9.188-5.993L22.33 2.572M5.959 5.376H19.5M7.583 23.25a1.083 1.083 0 1 0 0-2.166 1.083 1.083 0 0 0 0 2.167ZM18.958 17.835a1.083 1.083 0 1 0 0-2.167 1.083 1.083 0 0 0 0 2.167ZM7.583 11.335a1.083 1.083 0 1 0 0-2.167 1.083 1.083 0 0 0 0 2.167Z" />
      <path d="m8.667 21.626 9.75-4.334m.541-1.625v-.541a2.166 2.166 0 0 0-2.166-2.167h-3.25m-5.959-1.625v.542a1.083 1.083 0 0 0 1.084 1.083h3.25m8.125 8.125-2.167 2.167m2.167 0-2.167-2.167m-9.208-5.417L6.5 17.834m2.167 0L6.5 15.667" />
    </g>
    <defs>
      <clipPath id="plan_svg__a">
        <path fill="#fff" d="M0 .5h26v26H0z" />
      </clipPath>
    </defs>
  </svg>
);
const Memo = memo(SvgPlan);
export default Memo;
