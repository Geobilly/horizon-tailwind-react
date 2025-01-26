import React, { useMemo } from "react";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";

const Absent = () => {
  // Define columns directly in the component
  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Gender", accessor: "gender" },
      { Header: "Class", accessor: "class" },
    ],
    []
  );

  // Define real row data
  const data = useMemo(
    () => [
      { id: "1", name: "John Doe", gender: "Male", class: "2025-01-01" },
      { id: "2", name: "Jane Smith", gender: "Female", class: "2025-02-01" },
      { id: "3", name: "Sam Johnson", gender: "Male", class: "2025-03-01" },
      { id: "4", name: "Anna Williams", gender: "Female", class: "2025-04-01" },
      { id: "5", name: "Tom Lee", gender: "Male", class: "2025-05-01" },
      { id: "6", name: "Lucy Brown", gender: "Female", class: "2025-06-01" },
      { id: "7", name: "Paul Green", gender: "Male", class: "2025-07-01" },
      { id: "8", name: "Sophie White", gender: "Female", class: "2025-08-01" },
      { id: "9", name: "Chris Black", gender: "Male", class: "2025-09-01" },
      { id: "10", name: "Katie Grey", gender: "Female", class: "2025-10-01" },
      { id: "11", name: "Lucas Blue", gender: "Male", class: "2025-11-01" },
      { id: "12", name: "Olivia Red", gender: "Female", class: "2025-12-01" },
    ],
    []
  );

  // Set up the table instance with react-table hooks
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 6 }, // Limit to 6 rows per page
    },
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
        <div className="text-xl font-bold text-navy-700 dark:text-white">
         Absent List
        </div>
        {/* <CardMenu /> */}
      </header>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table {...getTableProps()} className="w-full" variant="simple" color="gray-500" mb="24px">
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border-b border-gray-200 pr-16 pb-[10px] text-start dark:!border-navy-700"
                    key={index}
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
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = null;
                    if (cell.column.Header === "Name") {
                      data = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {cell.value}
                        </p>
                      );
                    } else {
                      data = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {cell.value}
                        </p>
                      );
                    }
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={index}
                        className="pt-[14px] pb-[16px] sm:text-[14px]"
                      >
                        {data}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="btn btn-primary"
        >
          Previous
        </button>
        <span>
          Page {pageIndex + 1} of {pageCount}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
    </Card>
  );
};

export default Absent;
