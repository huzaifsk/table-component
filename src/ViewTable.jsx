import React, { useState } from "react";
import employeesData from "./data/employees_100.json";
import { Table, Th, Td, TBody, Tr, TFooter } from "./component/TableComponent";
import {
  Trash,
  Download,
  MoveLeft,
  MoveRight,
  EyeOff,
  Eye,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ViewTable() {
  const [employees, setEmployees] = useState(employeesData);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    location: "",
    manager: "",
    joinedDate: "",
  });
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingCell, setEditingCell] = useState(null); // { rowIndex, field }
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const toggleDetails = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  const handleRowSelect = (index) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(index)
        ? prevSelectedRows.filter((rowIndex) => rowIndex !== index)
        : [...prevSelectedRows, index],
    );
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) {
      toast.dismiss();
      toast.warning("No rows selected for deletion.");
      return;
    }

    setEmployees((prevEmployees) =>
      prevEmployees.filter((_, index) => !selectedRows.includes(index)),
    );
    setSelectedRows([]); // Reset selected rows after deletion
    toast.success("Selected rows deleted successfully");
  };

  const handleFilterChange = (e, key) => {
    setCurrentPage(1);
    setFilters({ ...filters, [key]: e.target.value });
  };

  const handleDateFilterChange = (e) => {
    setCurrentPage(1);
    setFilters({ ...filters, joinedDate: e.target.value });
  };

  const handleDoubleClick = (rowIndex, field) => {
    setEditingCell({ rowIndex, field });
  };

  const handleEditChange = (e, rowIndex, field) => {
    const updated = [...employees];
    updated[rowIndex][field] = e.target.value;
    setEmployees(updated);
  };

  const handleBlur = () => {
    setEditingCell(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setEditingCell(null); // save on Enter key
      toast.success("Changes done successfully");
    } else if (e.key === "Escape") {
      setEditingCell(null); // cancel on Escape key
    }
  };

  const filtered = employees.filter((emp) => {
    const joinedDateMatch = filters.joinedDate
      ? new Date(emp.joinedDate).getTime() ===
        new Date(filters.joinedDate).getTime()
      : true;

    return (
      (emp.name || "").toLowerCase().includes(filters.name.toLowerCase()) &&
      (emp.email || "").toLowerCase().includes(filters.email.toLowerCase()) &&
      (emp.role || "").toLowerCase().includes(filters.role.toLowerCase()) &&
      (emp.department || "")
        .toLowerCase()
        .includes(filters.department.toLowerCase()) &&
      (emp.location || "")
        .toLowerCase()
        .includes(filters.location.toLowerCase()) &&
      (emp.details?.manager || "")
        .toLowerCase()
        .includes(filters.manager.toLowerCase()) &&
      joinedDateMatch
    );
  });

  if (sortConfig.key) {
    filtered.sort((a, b) => {
      const valA = a[sortConfig.key] || "";
      const valB = b[sortConfig.key] || "";

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const uniqueRoles = [
    ...new Set(employees.map((e) => e.role).filter(Boolean)),
  ];
  const uniqueDepartments = [
    ...new Set(employees.map((e) => e.department).filter(Boolean)),
  ];

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  // Export to CSV function
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Role",
      "Department",
      "Location",
      "Joined Date",
      "Manager",
      "Projects",
      "Performance (2023)",
      "Performance (2022)",
      "Skills",
      "Last Promotion Date",
    ];

    const rows = filtered.map((emp) => [
      emp.name,
      emp.email,
      emp.role,
      emp.department,
      emp.location,
      emp.joinedDate,
      emp.details?.manager,
      emp.details?.projects ? emp.details.projects.join("; ") : "",
      emp.details?.performance?.["2023"] || "",
      emp.details?.performance?.["2022"] || "",
      emp.details?.skills ? emp.details.skills.join("; ") : "",
      emp.details?.lastPromotionDate || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((item) => `"${item}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { label: "Name", key: "name", width: "180px" },
    { label: "Email", key: "email", width: "240px" },
    { label: "Role", key: "role", width: "140px" },
    { label: "Department", key: "department", width: "160px" },
    { label: "Location", key: "location", width: "140px" },
    { label: "Joined Date", key: "joinedDate", width: "160px" },
    { label: "Details", key: "details", width: "80px" },
  ];

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="mb-4 flex justify-between">
        <button
          onClick={handleDeleteSelected}
          className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
        >
          <Trash className="w-5 h-5 mr-2" /> {/* Trash icon */}
          Delete Selected
        </button>
        <button
          onClick={exportToCSV}
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 ml-2 rounded flex items-center"
        >
          <Download className="w-5 h-5 mr-2" /> {/* Download icon */}
          Export to CSV
        </button>
      </div>
      <Table>
        <thead className="text-gray-800 text-sm font-semibold">
          <Tr>
            <Th>
              <input
                type="checkbox"
                checked={selectedRows.length === employees.length}
                onChange={() => {
                  if (selectedRows.length === employees.length) {
                    setSelectedRows([]);
                  } else {
                    setSelectedRows(employees.map((_, index) => index));
                  }
                }}
              />
            </Th>
            {columns.map((header) => (
              <Th
                key={header.key}
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => handleSort(header.key)}
              >
                <div className="flex items-center justify-between gap-1">
                  {header.label}
                  {sortConfig.key === header.key &&
                  sortConfig.direction === "asc" ? (
                    <ArrowUpWideNarrow className="w-4 h-4 inline" />
                  ) : (
                    <ArrowDownWideNarrow className="w-4 h-4 inline" />
                  )}
                </div>
              </Th>
            ))}
          </Tr>
          <Tr>
            <Th></Th>
            {[
              "name",
              "email",
              "role",
              "department",
              "location",
              "joinedDate",
              "details",
            ].map((key, i) => (
              <Th key={i} className="px-4 py-2">
                {key === "details" ? null : key === "joinedDate" ? (
                  <input
                    type="date"
                    placeholder={`Filter ${key}`}
                    value={filters[key] || ""}
                    onChange={handleDateFilterChange}
                    className="w-full py-1 text-gray-700 outline-none"
                  />
                ) : key === "role" ? (
                  <select
                    value={filters[key]}
                    onChange={(e) => handleFilterChange(e, key)}
                    className="w-full py-1 text-gray-700 outline-none"
                  >
                    <option value="">All Roles</option>
                    {uniqueRoles.map((role, idx) => (
                      <option key={idx} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                ) : key === "department" ? (
                  <select
                    value={filters[key]}
                    onChange={(e) => handleFilterChange(e, key)}
                    className="w-full py-1 text-gray-700 outline-none"
                  >
                    <option value="">All Departments</option>
                    {uniqueDepartments.map((dept, idx) => (
                      <option key={idx} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={`Filter ${key}`}
                    value={filters[key] || ""}
                    onChange={(e) => handleFilterChange(e, key)}
                    className="w-full py-1 text-gray-700 outline-none"
                  />
                )}
              </Th>
            ))}
          </Tr>
        </thead>

        <TBody
          data={paginatedData}
          renderRow={(emp, i) => {
            const actualIndex = (currentPage - 1) * rowsPerPage + i;
            const isExpanded = expandedRow === actualIndex;
            const editableFields = [
              "name",
              "email",
              "role",
              "department",
              "location",
            ];

            return (
              <>
                <Tr className="hover:bg-gray-100 transition-colors">
                  <Td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(actualIndex)}
                      onChange={() => handleRowSelect(actualIndex)}
                    />
                  </Td>
                  {editableFields.map((field) => (
                    <Td
                      key={field}
                      onDoubleClick={() =>
                        handleDoubleClick(actualIndex, field)
                      }
                      className="cursor-pointer"
                    >
                      {editingCell?.rowIndex === actualIndex &&
                      editingCell?.field === field ? (
                        <input
                          type="text"
                          value={employees[actualIndex][field]}
                          onChange={(e) =>
                            handleEditChange(e, actualIndex, field)
                          }
                          onBlur={handleBlur}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          className="w-full py-0.5 text-gray-700"
                        />
                      ) : (
                        employees[actualIndex][field]
                      )}
                    </Td>
                  ))}
                  <Td className="text-center">{emp.joinedDate}</Td>
                  <Td className="text-center">
                    <button
                      onClick={() => toggleDetails(actualIndex)}
                      title={isExpanded ? "Hide Details" : "Show Details"}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {isExpanded ? (
                        <EyeOff className="w-4 h-4 cursor-pointer" />
                      ) : (
                        <Eye className="w-4 h-4 cursor-pointer" />
                      )}
                    </button>
                  </Td>
                </Tr>

                <Tr className="bg-gray-50">
                  <Td colSpan={8} className="p-0 m-0 border-0" noDefault>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? "max-h-96 p-4" : "max-h-0 p-0"
                      }`}
                      style={{ backgroundColor: "#f9fafb" }}
                    >
                      <div className="grid grid-cols-4 gap-4 font-bold border-b pb-2 mb-2">
                        <div>Projects</div>
                        <div>Performance (2023)</div>
                        <div>Skills</div>
                        <div>Last Promotion Date</div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>{emp.details?.projects?.join(", ") || "N/A"}</div>
                        <div>{emp.details?.performance?.["2023"] || "N/A"}</div>
                        <div>{emp.details?.skills?.join(", ") || "N/A"}</div>
                        <div>{emp.details?.lastPromotionDate || "N/A"}</div>
                      </div>
                    </div>
                  </Td>
                </Tr>
              </>
            );
          }}
        />

        <TFooter>
          <Tr>
            <Td colSpan={8} className="text-center py-4">
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  <MoveLeft />
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  <MoveRight />
                </button>
              </div>
            </Td>
          </Tr>
        </TFooter>
      </Table>
    </div>
  );
}
