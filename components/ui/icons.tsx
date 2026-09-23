import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const CloseIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}><path d="M6 6l12 12M18 6 6 18" /></svg>
);

export const SettingsIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" />
  </svg>
);

export const CarIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="m5 11 1.8-4h10.4l1.8 4M4 11h16v7H4zM7 18v2M17 18v2" />
    <path d="M7 14h.01M17 14h.01" />
  </svg>
);

export const MotorcycleIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" />
    <path d="m8 17 3-6h3l4 6M9.5 14H15M12 11l-2-3H7M15 8h3" />
  </svg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}><path d="m7 9 5 5 5-5" /></svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}><path d="M5 12h14M14 7l5 5-5 5" /></svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}><path d="M19 12H5M10 7l-5 5 5 5" /></svg>
);

export const ArrowUpIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}><path d="M12 19V5M7 10l5-5 5 5" /></svg>
);

export const ArrowDownIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}><path d="M12 5v14M7 14l5 5 5-5" /></svg>
);

export const PlayIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M8 5.7v12.6c0 .8.9 1.3 1.6.8l9.1-6.3a1 1 0 0 0 0-1.6L9.6 4.9A1 1 0 0 0 8 5.7Z" /></svg>
);

export const PauseIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}><path d="M9 5v14M15 5v14" /></svg>
);

export const RestartIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6M4 4v4.6h4.6" /></svg>
);

export const SpeakerIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}><path d="M5 10v4h3l4 3V7L8 10H5ZM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" /></svg>
);

export const BoltIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}><path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" /></svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...baseProps} {...props}><path d="m5 12 4 4L19 6" /></svg>
);
