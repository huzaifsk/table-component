import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
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
  onClick,
  className = "",
  width,
  colSpan,
  noDefault = false,
  title,
}) {
  const handleClick = (e) => {
    onClick(e);
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
      onClick={handleClick}
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

export function SortableTh({ children, sortKey, sortConfig, onSort, width }) {
  const isSorted = sortConfig.key === sortKey;
  const directionIcon =
    sortConfig.direction === "asc" ? (
      <ArrowUpWideNarrow className="w-4 h-4" />
    ) : (
      <ArrowDownWideNarrow className="w-4 h-4" />
    );

  return (
    <Th
      onClick={() => onSort(sortKey)}
      width={width}
      className="cursor-pointer"
    >
      <div className="flex items-center justify-between gap-1">
        {children}
        {isSorted && directionIcon}
      </div>
    </Th>
  );
}

export function FilterableTh({
  value,
  onChange,
  options,
  isDate,
  placeholder = "Search...",
}) {
  if (options) {
    return (
      <Th>
        <select
          value={value}
          onChange={onChange}
          className="w-full text-gray-700"
        >
          <option value="">All</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </Th>
    );
  }

  if (isDate) {
    return (
      <Th>
        <input
          type="date"
          value={value}
          onChange={onChange}
          className="w-full text-gray-700"
        />
      </Th>
    );
  }

  return (
    <Th>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-gray-700 outline-0 border-0"
      />
    </Th>
  );
}
