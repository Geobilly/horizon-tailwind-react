import React, { useMemo, useState, useEffect } from "react";
import CardMenu from "components/card/CardMenu";
import EntriesMenuCard from "components/card/EntriesMenuCard";

import TableCard from "components/card/EntryTableCard";
// import EditStudent from "../../form/EditStudent";
// import DeleteStudent from "../../form/DeleteStudent";
// import PrintCode from "../../form/PrintCode";
import ViewEntry from "../../form/ViewEntry";
import DeleteEntry from "../../form/DeleteEntry";


import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { MdQrCode } from "react-icons/md";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { jwtDecode } from "jwt-decode";
import CircularWithValueLabel from "../../../../components/loader/index"; // Import the loader component
import { AiOutlineWarning } from "react-icons/ai"; // Import warning icon

const EntriesTable = () => {
  const [filteredData, setFilteredData] = useState([]);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [isPrintCodeModalOpen, setIsPrintCodeModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  // Fetch entry data from API
const fetchEntryData = async (schoolId) => {
  setIsLoading(true); // Start loading
  try {
    const response = await fetch(`https://edupaygh-backend.onrender.com/fetchentries/${schoolId}`);
    const data = await response.json();
// Sort entries by created_at in descending order
const sortedEntries = data.entries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
setFilteredData(sortedEntries);  } catch (error) {
    console.error("Error fetching entry data:", error);
  } finally {
    setIsLoading(false); // Stop loading
  }
};

useEffect(() => {
  const schoolId = getSchoolId();
  if (schoolId) {
    fetchEntryData(schoolId);
  }
}, []);


useEffect(() => {
  if (searchQuery === "") {
    const schoolId = getSchoolId();
    if (schoolId) fetchEntryData(schoolId); // Call the updated fetch function
  } else {
    const filtered = filteredData.filter((entry) =>
      entry.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.terminal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
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


  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "CLASS", accessor: "class" },
      { Header: "TERMINAL", accessor: "terminal" },
      { Header: "DATE/TIME", accessor: "created_at" },
      { Header: "AMOUNT", accessor: "total_amount" },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            style={{
              color: value === "Pending" ? "red" : value === "Approved" ? "green" : "black",
              fontWeight: "bold",
            }}
          >
            {value}
          </span>
        ),
      },
            {
        Header: "ACTION",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <AiOutlineEye
              className="text-blue-500 text-2xl cursor-pointer"
              title="View"
              onClick={() => {
                setSelectedEntry(row.original);
                setIsViewModalOpen(true);
              }}
            />
            <AiOutlineDelete
              className="text-red-500 text-2xl cursor-pointer"
              title="Delete"
              onClick={() => setIsDeleteModalOpen(true)}
            />
          </div>
        ),
      },

    ],
    [navigate, role, selectedStudents]
  );

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
        <div className="text-xl font-bold text-navy-700 dark:text-white">Entries</div>
        <EntriesMenuCard />
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


      {/* Modal Component */}
      <ViewEntry
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          // Refresh table data after closing the modal
          const schoolId = getSchoolId();
          if (schoolId) {
            fetchEntryData(schoolId);
          }
        }}
        entry={selectedEntry}
      />

      <DeleteEntry
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    

    </TableCard>
  );
};


export default EntriesTable;
