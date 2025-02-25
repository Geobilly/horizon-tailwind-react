import React, { useMemo, useState, useEffect } from "react";
import CardMenu from "components/card/CardMenu";
import TableCard from "components/card/EntryTableCard";
import PermissionMenuCard from "components/card/PermissionMenuCard";

// import EditStudent from "../../form/EditStudent";
// import DeleteStudent from "../../form/DeleteStudent";
// import PrintCode from "../../form/PrintCode";
import EditTerminal from "../../form/EditTerminal";
import DeleteTerminal from "../../form/DeleteTerminal";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { MdQrCode } from "react-icons/md";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { jwtDecode } from "jwt-decode";
import CircularWithValueLabel from "../../../../components/loader/index"; // Import the loader component
import { AiOutlineWarning } from "react-icons/ai"; // Import warning icon

const Permission = () => {
  const [filteredData, setFilteredData] = useState([]);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [isPrintCodeModalOpen, setIsPrintCodeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to manage EditStudent modal visibility
  const [isEditTerminalModalOpen, setIsEditTerminalModalOpen] = useState(false); // State to manage EditStudent modal 
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // New loading state

  const navigate = useNavigate();

  // Decode the token and get the school_id
  const getSchoolId = () => {
    const userToken = JSON.parse(localStorage.getItem("Edupay"))?.token;
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      return decodedToken.school_id;
    }
    return null;
  };

  // Fetch permissions data from API
  const fetchPermissionsData = async (schoolId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://edupaygh-backend.onrender.com/getpermissions/${schoolId}`);
      const data = await response.json();
      if (Array.isArray(data.permissions)) {
        // Sort the permissions array by id in descending order
        const sortedData = data.permissions.sort((a, b) => b.id - a.id);
        setFilteredData(sortedData);
      }
    } catch (error) {
      console.error("Error fetching permissions data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const schoolId = getSchoolId();
    if (schoolId) {
      fetchPermissionsData(schoolId);
    }
  }, []);

  const handleCheckboxChange = (student, isChecked) => {
    setSelectedStudents((prev) =>
      isChecked
        ? [...prev, student]
        : prev.filter((s) => s.student_id !== student.student_id)
    );
  };

  const handleEditClick = (studentId) => {
    setSelectedStudentId(studentId);
    // setIsEditModalOpen(true);
  };

  const getRoleFromToken = () => {
    const tokenData = localStorage.getItem("Edupay");
    if (tokenData) {
      try {
        const { token } = JSON.parse(tokenData);
        const decodedToken = jwtDecode(token);
        return decodedToken.role;
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    return null;
  };
  const role = getRoleFromToken();

  const columns = useMemo(() => [
    { Header: "ID", accessor: "id" },
    { Header: "STUDENT NAME", accessor: "student_name" },
    { Header: "CLASS", accessor: "class" },
    { Header: "TERMINAL", accessor: "terminal" },
    { Header: "REASON", accessor: "reason" },
    { Header: "CONTACT", accessor: "guardian_contact" },
    { 
      Header: "DATE", 
      accessor: "created_at",
    },
    {
      Header: "FILE",
      accessor: "file_url",
      Cell: ({ value }) => (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          <AiOutlineEye className="text-2xl" />
        </a>
      )
    }
    /* Commented out Action column
    {
      Header: "ACTION",
      accessor: "action",
      Cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <AiOutlineEdit
            className="text-yellow-500 text-2xl cursor-pointer"
            title="Edit"
            onClick={() => setIsEditTerminalModalOpen(true)}
          />
          <AiOutlineDelete
            className="text-red-500 text-2xl cursor-pointer"
            title="Delete"
            onClick={() => setIsDeleteModalOpen(true)}
          />
        </div>
      ),
    }
    */
  ], []);
  

  const tableInstance = useTable(
    { columns, data: filteredData, initialState: { pageSize: 11 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { globalFilter },
    setGlobalFilter,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  return (
    <TableCard extra={"w-full p-4"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">Permissions</div>
        <PermissionMenuCard 
          onClose={(success) => {
            // Only refresh if the submission was successful
            if (success) {
              const schoolId = getSchoolId();
              if (schoolId) {
                fetchPermissionsData(schoolId);
              }
            }
          }}
        />
      </header>

      <div className="flex justify-between items-center mb-4">
  <input
    type="text"
    value={globalFilter || ""}
    onChange={(e) => setGlobalFilter(e.target.value || undefined)}
    placeholder="Search..."
    className="border p-2 rounded bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>


      {isLoading ? (
        <div className="flex justify-center items-center mt-8">
          <CircularWithValueLabel size={60} />
        </div>
      ) : filteredData.length === 0 ? (
        // If no data is found, show "No Data Available" icon/message
        <div className="flex justify-center items-center mt-8 text-xl text-gray-500">
          <AiOutlineWarning className="text-4xl mr-2" />
          <span>No Data Available</span>
        </div>
      ) : (
        <div className="mt-8" style={{ height: "60vh", overflowY: "auto" }}>
          <table {...getTableProps()} className="w-full">
            <thead className="sticky top-0 bg-white dark:bg-navy-800">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="border-b border-gray-200 pr-8 pb-[10px] text-start dark:!border-navy-700"
                    >
                      <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                        {column.render("Header")}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="pt-[14px] pb-[16px] sm:text-[14px]"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
<div className="flex justify-between items-center mt-4">
  {/* Pagination buttons */}
  <button
    onClick={() => gotoPage(0)}
    disabled={!canPreviousPage}
    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-navy-800 dark:hover:bg-navy-700 dark:disabled:bg-navy-900 dark:disabled:opacity-50 text-navy-700 dark:text-white rounded-md"
  >
    {"<<"}
  </button>
  <button
    onClick={() => previousPage()}
    disabled={!canPreviousPage}
    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-navy-800 dark:hover:bg-navy-700 dark:disabled:bg-navy-900 dark:disabled:opacity-50 text-navy-700 dark:text-white rounded-md"
  >
    {"<"}
  </button>
  <span className="text-sm text-navy-700 dark:text-white">
    Page{" "}
    <strong>
      {pageIndex + 1} of {pageOptions.length}
    </strong>
  </span>
  <button
    onClick={() => nextPage()}
    disabled={!canNextPage}
    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-navy-800 dark:hover:bg-navy-700 dark:disabled:bg-navy-900 dark:disabled:opacity-50 text-navy-700 dark:text-white rounded-md"
  >
    {">"}
  </button>
  <button
    onClick={() => gotoPage(pageCount - 1)}
    disabled={!canNextPage}
    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-navy-800 dark:hover:bg-navy-700 dark:disabled:bg-navy-900 dark:disabled:opacity-50 text-navy-700 dark:text-white rounded-md"
  >
    {">>"}
  </button>
  <select
    value={pageSize}
    onChange={(e) => setPageSize(Number(e.target.value))}
    className="ml-2 border border-gray-300 dark:border-navy-700 rounded-md bg-white dark:bg-navy-800 text-navy-700 dark:text-white"
  >
    {[10, 20, 30, 40, 50].map((size) => (
      <option key={size} value={size}>
        Show {size}
      </option>
    ))}
  </select>
</div>


      {/* Render the EditStudent modal */}
      <EditTerminal 
        isOpen={isEditTerminalModalOpen} 
        onClose={() => {
          setIsEditTerminalModalOpen(false);
          // Refresh table data after closing the modal
          const schoolId = getSchoolId();
          if (schoolId) {
            fetchPermissionsData(schoolId);
          }
        }} 
      />
      <DeleteTerminal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          // Refresh table data after closing the modal
          const schoolId = getSchoolId();
          if (schoolId) {
            fetchPermissionsData(schoolId);
          }
        }} 
      />

    </TableCard>
  );
};


export default Permission;
