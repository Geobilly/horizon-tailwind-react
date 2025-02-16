import React, { useMemo, useState, useEffect } from "react";
import CardMenu from "components/card/CardMenu";
import TableCard from "components/card/EntryTableCard";
import TerminalMenuCard from "components/card/TerminalMenuCard";

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

const TerminalTable = () => {
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
      const decodedToken = jwtDecode(userToken);  // Use jwtDecode here
      console.log("Decoded school_id:", decodedToken.school_id);  // Log the school_id
      return decodedToken.school_id;
    }
    return null;
  };

  // Fetch terminal data from the new API using school_id
  const fetchTerminalData = async (schoolId) => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(`https://edupaygh-backend.onrender.com/fetchterminal/${schoolId}`);
      const data = await response.json();
      
      // Check if "terminals" exists and is an array
      if (Array.isArray(data.terminals)) {
        // Sort terminals by id in descending order (latest first)
        const sortedTerminals = data.terminals.sort((a, b) => b.id - a.id);
        setFilteredData(sortedTerminals);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching terminal data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  

useEffect(() => {
  const schoolId = getSchoolId();
  if (schoolId) {
    fetchTerminalData(schoolId); // Call the updated API function
  }
}, []);

// Search logic can remain the same or be adapted based on the fetched terminal data
useEffect(() => {
  if (searchQuery === "") {
    const schoolId = getSchoolId();
    if (schoolId) fetchTerminalData(schoolId); // Refresh data if no search query
  } else {
    const filtered = filteredData.filter((terminal) =>
      terminal.terminal_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered); // Filter data based on search query
  }
}, [searchQuery]);


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
        const { token } = JSON.parse(tokenData); // Parse the stored object to extract the token
        const decodedToken = jwtDecode(token); // Use the correct function from jwt-decode
        return decodedToken.role; // Assuming "role" is a field in your token payload
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    return null;
  };
  const role = getRoleFromToken();


  const columns = useMemo(() => {
    const baseColumns = [
      { Header: "ID", accessor: "id" },
      { Header: "NAME", accessor: "terminal_name" },
      { Header: "PRICE", accessor: "price" },
      { Header: "DATE CREATED", accessor: "updated_at" },
    ];
  
    if (role !== "accountant" && role !== "teacher") {
      baseColumns.push({
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
      });
    }
  
    return baseColumns;
  }, [role]);
  

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
        <div className="text-xl font-bold text-navy-700 dark:text-white">Terminal </div>
        <TerminalMenuCard />
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
      <EditTerminal isOpen={isEditTerminalModalOpen} onClose={() => setIsEditTerminalModalOpen(false)} />
      <DeleteTerminal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />

    </TableCard>
  );
};


export default TerminalTable;
