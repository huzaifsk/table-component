import React, { useState } from "react";
import employeesData from "./data/employees_100.json";
import {
  Table,
  Th,
  Td,
  TBody,
  Tr,
  TFooter,
  SortableTh,
  FilterableTh,
} from "./component/TableComponent";
import {
  Trash,
  Download,
  MoveLeft,
  MoveRight,
  EyeOff,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import Chip from "./component/Chip";

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

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) {
      toast.warning("No rows selected for deletion.");
      return;
    }

    setEmployees((prev) =>
      prev.filter((emp) => !selectedRows.includes(emp.id)),
    );
    setSelectedRows([]);
    toast.success("Selected rows deleted successfully");
  };

  const handleFilterChange = (e, key) => {
    setCurrentPage(1);
    setFilters({ ...filters, [key]: e.target.value });
  };

  const handleClick = (rowIndex, field) => {
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
      setEditingCell(null);
      toast.success("Changes saved");
    } else if (e.key === "Escape") {
      setEditingCell(null);
    }
  };

  const filtered = employees.filter((emp) => {
    const joinedDateMatch = filters.joinedDate
      ? emp.joinedDate?.split("T")[0] === filters.joinedDate
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

  const sorted = [...filtered];
  if (sortConfig.key) {
    sorted.sort((a, b) => {
      const valA = (a[sortConfig.key] || "").toString().toLowerCase();
      const valB = (b[sortConfig.key] || "").toString().toLowerCase();
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginatedData = sorted.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const uniqueRoles = [
    ...new Set(employees.map((e) => e.role).filter(Boolean)),
  ];
  const uniqueDepartments = [
    ...new Set(employees.map((e) => e.department).filter(Boolean)),
  ];

  const colorMap = {
    role: {
      "Product Manager": "bg-blue-100 text-blue-800",
      "Data Analyst": "bg-red-100 text-red-800",
      Developer: "bg-green-100 text-green-800",
      Designer: "bg-yellow-100 text-yellow-800",
      "QA Engineer": "bg-purple-100 text-purple-800",
      All: "bg-gray-100 text-gray-800", // Optional if used for filtering
      default: "bg-gray-100 text-gray-800",
    },
    department: {
      Engineering: "bg-blue-100 text-blue-800",
      Quality: "bg-rose-100 text-rose-800",
      Data: "bg-teal-100 text-teal-800",
      Product: "bg-violet-100 text-violet-800",
      Design: "bg-yellow-100 text-yellow-800",
      default: "bg-gray-100 text-gray-800",
    },
  };

  const getColorClass = (field, value) => {
    return colorMap[field]?.[value] || colorMap[field]?.default || "";
  };

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
      emp.details?.projects?.join("; ") || "",
      emp.details?.performance?.["2023"] || "",
      emp.details?.performance?.["2022"] || "",
      emp.details?.skills?.join("; ") || "",
      emp.details?.lastPromotionDate || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((item) => `"${item}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "employees.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { label: "Name", key: "name", width: "180px" },
    { label: "Email", key: "email", width: "240px" },
    { label: "Role", key: "role", width: "180px" },
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
          <Trash className="w-5 h-5 mr-2" />
          Delete Selected
        </button>
        <button
          onClick={exportToCSV}
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 ml-2 rounded flex items-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Export to CSV
        </button>
      </div>

      <Table>
        <thead>
          <Tr>
            <Th width={"20px"}>
              <input
                type="checkbox"
                checked={paginatedData.every((emp) =>
                  selectedRows.includes(emp.id),
                )}
                onChange={() => {
                  const ids = paginatedData.map((emp) => emp.id);
                  if (ids.every((id) => selectedRows.includes(id))) {
                    setSelectedRows((prev) =>
                      prev.filter((id) => !ids.includes(id)),
                    );
                  } else {
                    setSelectedRows((prev) => [...new Set([...prev, ...ids])]);
                  }
                }}
              />
            </Th>
            {columns.map((header) => (
              <SortableTh
                key={header.key}
                sortKey={header.key}
                sortConfig={sortConfig}
                onSort={handleSort}
                width={header.width}
              >
                {header.label}
              </SortableTh>
            ))}
          </Tr>
          <Tr>
            <Th></Th>
            {columns.map((col, i) => {
              const isDate = col.key === "joinedDate";
              const options =
                col.key === "role"
                  ? uniqueRoles
                  : col.key === "department"
                  ? uniqueDepartments
                  : null;

              return (
                <FilterableTh
                  key={i}
                  value={filters[col.key]}
                  onChange={(e) => handleFilterChange(e, col.key)}
                  options={options}
                  isDate={isDate}
                />
              );
            })}
          </Tr>
        </thead>

        {paginatedData.length === 0 ? (
          <tbody>
            <Tr>
              <Td colSpan={columns.length + 1} className="text-center py-6">
                No data found.
              </Td>
            </Tr>
          </tbody>
        ) : (
          <TBody
            data={paginatedData}
            renderRow={(emp, i) => {
              const actualIndex = employees.findIndex((e) => e.id === emp.id);
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
                        checked={selectedRows.includes(emp.id)}
                        onChange={() => handleRowSelect(emp.id)}
                      />
                    </Td>
                    {editableFields.map((field) => (
                      <Td
                        key={field}
                        onClick={() => handleClick(actualIndex, field)}
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
                            className="w-full text-gray-700"
                          />
                        ) : field === "role" || field === "department" ? (
                          <Chip
                            colorClass={getColorClass(
                              field,
                              employees[actualIndex][field],
                            )}
                            label={employees[actualIndex][field]}
                          />
                        ) : (
                          employees[actualIndex][field]
                        )}
                      </Td>
                    ))}
                    <Td className="text-center">{emp.joinedDate}</Td>
                    <Td className="text-center">
                      <button onClick={() => toggleDetails(actualIndex)}>
                        {isExpanded ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </Td>
                  </Tr>

                  <Tr>
                    <Td
                      colSpan={columns.length + 1}
                      className="p-0 m-0 border-0"
                      noDefault
                    >
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
                          <div>
                            {emp.details?.projects?.join(", ") || "N/A"}
                          </div>
                          <div>
                            {emp.details?.performance?.["2023"] || "N/A"}
                          </div>
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
        )}

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
