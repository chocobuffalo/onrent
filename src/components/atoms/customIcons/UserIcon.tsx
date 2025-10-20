export default function UserIcon({ color }: { color?: string }) {
    const currentColor = color ? color : "#fff";
    return (
      <svg
        style={{ opacity: 0.5 }}
        width="32"
        height="32"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="0" width="24" height="24" rx="8" fill="none" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={currentColor}
          x="0"
          y="0"
          width="20"
          height="20"
        >
          <g
            fill="none"
            stroke={currentColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
          >
            {/* Cabeza */}
            <circle cx="12" cy="8" r="4" />
            {/* Cuerpo */}
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </g>
        </svg>
      </svg>
    );
  }
  