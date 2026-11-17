/** Stroke icons used across the app. Add a path here instead of importing an icon library. */
const PATHS = {
  home: 'M3 10.5 12 4l9 6.5V20H3z',
  log: 'M6 4h12v16H6zM9 9h6M9 13h6M9 17h3',
  program: 'M4 5h16v15H4zM4 10h16M9 3v4M15 3v4',
  progress: 'M4 19l5-6 4 3 7-9',
  coach: 'M4 5h16v11H9l-5 4z',
  back: 'M15 5l-7 7 7 7',
  check: 'M5 12l5 5 9-10',
  plus: 'M12 5v14M5 12h14',
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 22 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
