import React, { useState, useEffect, useMemo } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import Card from "components/card";
import { useTable, useGlobalFilter, useSortBy, usePagination } from "react-table";
import MiniCalendar from "components/calendar/MiniCalendar";
import { jwtDecode } from "jwt-decode";

const getSchoolId = () => {
  const userToken = JSON.parse(localStorage.getItem("Edupay"))?.token;
  return userToken ? jwtDecode(userToken).school_id : null;
};

const fetchAndStoreData = async () => {
  try {
    const schoolId = getSchoolId();
    if (!schoolId) return null;

    // Fetch the data directly from the API
    const response = await fetch(`https://edupaygh-backend.onrender.com/fetchreport/${schoolId}`);
    const data = await response.json();

    // Filter out items where status is "Pending"
    const filteredData = data.not_paid_students.filter(item => item.status !== 'Pending');

    return filteredData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const CheckTable = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [notPaidStudents, setNotPaidStudents] = useState([]);

  useEffect(() => {
    // Lazy load data in the background
    const loadNotPaidStudents = async () => {
      setTimeout(async () => {
        const data = await fetchAndStoreData();
        if (data) setNotPaidStudents(data);
      }, 0); // This defers data fetching to after render
    };
    loadNotPaidStudents();
  }, []);  // Ensure the effect runs only once on mount

  const columns = useMemo(
    () => [
      { Header: "Student ID", accessor: "student_id" },
      { Header: "Student Name", accessor: "student_name" },
      { Header: "Class", accessor: "class" },
      { Header: "Terminal", accessor: "terminal" },
      { Header: "Date", accessor: "date" },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return notPaidStudents.filter((item) => !selectedDate || item.date === selectedDate);
  }, [selectedDate, notPaidStudents]);

  const tableInstance = useTable(
    { columns, data: filteredData, initialState: { pageSize: 5 } },
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
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = tableInstance;

  return (
    <Card extra="w-full h-full sm:overflow-auto px-6">
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">Not Paid Students</div>
      </header>
      
      <div className="flex gap-4 mt-4">
        <div className="relative">
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="p-2 rounded-lg flex items-center gap-2 bg-lightPrimary dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 shadow-md dark:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200"
          >
            <MdOutlineCalendarToday className="text-gray-600 dark:text-gray-300" />
            {selectedDate || "Select Date"}
          </button>
          {isCalendarOpen && (
            <div className="absolute z-10 mt-2 p-2 rounded-lg bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700">
              <MiniCalendar onSelect={(date) => { setSelectedDate(date); setIsCalendarOpen(false); }} />
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="border-b border-gray-200 pr-16 pb-[10px] text-start dark:!border-navy-700">
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
                    <td {...cell.getCellProps()} className="pt-[14px] pb-[16px] sm:text-[14px]">
                      <p className="text-sm font-bold text-navy-700 dark:text-white">{cell.value}</p>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className="btn btn-primary">Previous</button>
        <span>Page {pageIndex + 1}</span>
        <button onClick={() => nextPage()} disabled={!canNextPage} className="btn btn-primary">Next</button>
      </div>
    </Card>
  );
};


export default CheckTable;