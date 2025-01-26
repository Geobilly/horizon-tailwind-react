import React, { useMemo, useState, useEffect } from "react";
import CardMenu from "components/card/CardMenu";
import TableCard from "components/card/EntryTableCard";
import EditStudent from "../../form/EditStudent";
import DeleteStudent from "../../form/DeleteStudent";
import PrintCode from "../../form/PrintCode";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { MdQrCode } from "react-icons/md";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { jwtDecode } from "jwt-decode";
import CircularWithValueLabel from "../../../../components/loader/index"; // Import the loader component
import { AiOutlineWarning } from "react-icons/ai"; // Import warning icon

const StudentList = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPrintCodeModalOpen, setIsPrintCodeModalOpen] = useState(false);
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

  // Fetch student data from API
  const fetchStudentData = async (schoolId) => {
    setIsLoading(true);  // Start loading
    try {
      const response = await fetch(`https://edupaygh-backend.onrender.com/fetchstudents/${schoolId}`);
      const data = await response.json();
      setFilteredData(data.students);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setIsLoading(false);  // Stop loading
    }
  };

  useEffect(() => {
    const schoolId = getSchoolId();
    if (schoolId) {
      fetchStudentData(schoolId);
    }
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      const schoolId = getSchoolId();
      if (schoolId) fetchStudentData(schoolId);
    } else {
      const filtered = filteredData.filter((student) =>
        student.student_name.toLowerCase().includes(searchQuery.toLowerCase())
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
    setIsEditModalOpen(true);
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
      {
        Header: "STUDENT ID",
        accessor: "student_id",
        Cell: ({ row }) => {
          const student = row.original;
          const isChecked = selectedStudents.some(
            (s) => s.student_id === student.student_id
          );

          return (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleCheckboxChange(student, e.target.checked)}
                className="checkbox-style"
              />
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {student.student_id}
              </p>
            </div>
          );
        },
      },
      { Header: "NAME", accessor: "student_name" },
      { Header: "GENDER", accessor: "gender" },
      { Header: "CLASS", accessor: "class" },
      {
        Header: "ACTION",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <AiOutlineEye
              className="text-blue-500 text-2xl cursor-pointer"
              title="View"
              onClick={() => navigate("/admin/profile")}
            />
           <AiOutlineEdit
            className={`text-yellow-500 text-2xl ${
              role === "accountant" || role === "teacher" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            title="Edit"
            onClick={() => role !== "accountant" && role !== "teacher" && handleEditClick(row.original.student_id)}
          />
          <AiOutlineDelete
            className={`text-red-500 text-2xl ${
              role === "accountant" || role === "teacher" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            title="Delete"
            onClick={() => role !== "accountant" && role !== "teacher" && setIsDeleteModalOpen(true)}
          />
            <MdQrCode
              className="text-blue-500 text-2xl cursor-pointer"
              title="Print Qrcode"
              onClick={() => setIsPrintCodeModalOpen(true)}
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
        <div className="text-xl font-bold text-navy-700 dark:text-white">Student</div>
        <CardMenu />
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


      <EditStudent
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        studentId={selectedStudentId}
      />
      <DeleteStudent
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
      <PrintCode
        isOpen={isPrintCodeModalOpen}
        onClose={() => setIsPrintCodeModalOpen(false)}
      />
    </TableCard>
  );
};


export default StudentList;
