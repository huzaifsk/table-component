import React from "react";

const colors = [
  "bg-red-100 text-red-800",
  "bg-green-100 text-green-800",
  "bg-blue-100 text-blue-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
  "bg-teal-100 text-teal-800",
];

function getRandomColor() {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

export default function Chip({ label }) {
  const colorClass = getRandomColor();

  return (
    <span
      className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${colorClass}`}
    >
      {label}
    </span>
  );
}
