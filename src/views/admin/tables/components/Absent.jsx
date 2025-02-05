import React, { useState, useMemo, useEffect } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import Card from "components/card";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import MiniCalendar from "components/calendar/MiniCalendar";

const Absent = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // Define columns
  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Gender", accessor: "gender" },
      { Header: "Class", accessor: "class" },
      { Header: "Category", accessor: "category" },
    ],
    []
  );

  // Real data
  const allData = useMemo(
    () => [
      { id: "1", name: "John Doe", gender: "Male", class: "2025-01-01", category: "A" },
      { id: "2", name: "Jane Smith", gender: "Female", class: "2025-02-01", category: "B" },
      { id: "3", name: "Sam Johnson", gender: "Male", class: "2025-03-01", category: "A" },
      { id: "4", name: "Anna Williams", gender: "Female", class: "2025-04-01", category: "C" },
      { id: "5", name: "Tom Lee", gender: "Male", class: "2025-05-01", category: "B" },
    ],
    []
  );

  // Extract unique categories
  useEffect(() => {
    const uniqueCategories = [...new Set(allData.map(item => item.category))];
    setCategories(uniqueCategories);
  }, [allData]);

  // Filter data
  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      return (
        (!selectedDate || item.class === selectedDate) &&
        (!selectedCategory || item.category === selectedCategory)
      );
    });
  }, [selectedDate, selectedCategory, allData]);

  // Table instance
  const tableInstance = useTable(
    { columns, data: filteredData, initialState: { pageSize: 6 } },
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
    pageCount,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = tableInstance;

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">Absent</div>
      </header>
      
      {/* Filters */}
      <div className="flex gap-4 mt-4">
        {/* Date Picker */}
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
        
        {/* Category Selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 shadow-md dark:shadow-lg"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      {/* Table */}
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
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className="btn btn-primary">Previous</button>
        <span>Page {pageIndex + 1} of {pageCount}</span>
        <button onClick={() => nextPage()} disabled={!canNextPage} className="btn btn-primary">Next</button>
      </div>
    </Card>
  );
};

export default Absent;