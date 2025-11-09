import * as React from "react";

export default function DoubleCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 6l-7.5 7.5L7 11" />
      <path d="M21 6l-7.5 7.5L13 11" />
    </svg>
  );
}
