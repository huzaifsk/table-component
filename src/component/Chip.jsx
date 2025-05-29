import React from "react";

export default function Chip({ label, colorClass }) {
  return (
    <span
      className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${colorClass}`}
    >
      {" "}
      {label}
    </span>
  );
}
