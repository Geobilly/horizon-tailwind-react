import React, { useMemo, useState, useEffect } from "react";
import EntriesMenuCard from "components/card/EntriesMenuCard";
import TableCard from "components/card/EntryTableCard";
import Checkbox from "components/checkbox";
import { AiOutlineCloud, AiOutlineEye, AiOutlineDelete } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import CircularWithValueLabel from "components/loader/";
import ViewEntry from "../../form/ViewEntry";
import DeleteEntry from "../../form/DeleteEntry";

const EntriesTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to manage EditStudent modal visibility
  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const results = data.filter((row) =>
        Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(lowerCaseQuery)
        )
      );
      setFilteredData(results);
    }
  };

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "CLASS", accessor: "class" },
      { Header: "TERMINAL", accessor: "terminal" },
      { Header: "DATE", accessor: "date" },
      { Header: "AMOUNT", accessor: "amount" },
      { Header: "STATUS", accessor: "status" },
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
    []
  );

  const data = useMemo(
    () => [
      {
        id: "001",
        class: "Class 2",
        terminal: "Bus Fees",
        date: "20/07/2024",
        amount: "₵103",
        status: "Pending",
      },
    ],
    []
  );

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setFilteredData(data);
    }, 3000);
  }, [data]);

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
  } = tableInstance;

  return (
    <TableCard extra={"w-full p-4"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Entries
        </div>
        <EntriesMenuCard />
      </header>

      <div className="relative mt-4 flex h-[61px] w-full items-center gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:bg-navy-800 dark:shadow-none md:w-[365px]">
        <div className="flex h-full w-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            className="pl-10 pr-4 py-2 w-full rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white"
          />
        </div>
      </div>

      <div
        className="mt-8"
        style={{
          height: "60vh",
          overflowY: "auto",
        }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <CircularWithValueLabel size={100} />
          </div>
        ) : (
          <table {...getTableProps()} className="w-full">
            <thead className="sticky top-0 bg-white dark:bg-navy-800">
              {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="border-b border-gray-200 pr-8 pb-[10px] text-start dark:!border-navy-700"
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
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="flex flex-col items-center justify-center h-full py-8">
                      <AiOutlineCloud size={50} className="text-gray-500" />
                      <p className="text-xl font-bold text-gray-500">No Data</p>
                    </div>
                  </td>
                </tr>
              ) : (
                page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={index}>
                      {row.cells.map((cell, index) => (
                        <td
                          {...cell.getCellProps()}
                          key={index}
                          className="pt-[14px] pb-[16px] sm:text-[14px]"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* Modal Component */}
      <ViewEntry
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        entry={selectedEntry}
      />

<DeleteEntry isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />

    </TableCard>
  );
};

export default EntriesTable;