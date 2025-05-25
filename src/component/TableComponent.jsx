import React from "react";

export function Table({ children, className = "" }) {
  return (
    <div
      className={`overflow-x-auto rounded-lg border border-neutral-200 ${className}`}
    >
      <table className="w-full border-collapse text-left text-neutral-900 bg-white">
        {children}
      </table>
    </div>
  );
}

export function Th({ children, width, onClick }) {
  return (
    <th
      onClick={onClick}
      className="px-6 py-3 border border-neutral-200 font-medium"
      style={width ? { width: width } : {}}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  onDoubleClick,
  className = "",
  width,
  colSpan,
  noDefault = false,
  title,
}) {
  const handleDoubleClick = (e) => {
    if (onDoubleClick) {
      onDoubleClick(e);
    }
  };

  const baseClass = noDefault
    ? className
    : `px-6 py-4 border border-neutral-200 text-neutral-700 ${className}`;

  return (
    <td
      title={title}
      className={baseClass}
      style={width ? { width: width } : {}}
      colSpan={colSpan}
      onDoubleClick={handleDoubleClick}
    >
      {children}
    </td>
  );
}

export function TBody({ data = [], renderRow }) {
  return <tbody>{data.map((row, index) => renderRow(row, index))}</tbody>;
}

export function TFooter({ children }) {
  return <tfoot className="bg-neutral-100">{children}</tfoot>;
}

export function Tr({ children }) {
  return <tr className="hover:bg-neutral-50">{children}</tr>;
}
