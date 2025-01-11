import React, { useMemo, useState, useEffect } from "react";
import CardMenu from "components/card/CardMenu";
import TableCard from "components/card/EntryTableCard";
import Checkbox from "components/checkbox";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { AiOutlineCloud, AiOutlineEye, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import CircularWithValueLabel from "components/loader/";
import { FiSearch } from "react-icons/fi";
import EditStudent from "../../form/EditStudent";
import DeleteStudent from "../../form/DeleteStudent";
import ViewEntry from "../../form/ViewEntry";



const QrcodeTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to manage EditStudent modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to manage EditStudent modal visibility
  


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate(); // Initialize navigate hook

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

  // Define table columns
  const columns = useMemo(
    () => [
      { Header: "STUDENT ID", accessor: "student_id" },
      { Header: "IMAGE", accessor: "image" },
      { Header: "NAME", accessor: "name" },
      { Header: "GENDER", accessor: "gender" },
      { Header: "CLASS", accessor: "class" },
      { Header: "QRCODE", accessor: "qrcode" },

      {
        Header: "ACTION",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {/* Navigate to profile page on clicking the eye icon */}
            <AiOutlineEye
              className="text-blue-500 text-2xl cursor-pointer"
              title="View"
              onClick={() => navigate("/admin/profile")}
            />
            {/* Open the EditStudent modal on clicking the edit icon */}
            <AiOutlineEdit
              className="text-yellow-500 text-2xl cursor-pointer"
              title="Edit"
              onClick={() => setIsEditModalOpen(true)}
            />
            <AiOutlineDelete className="text-red-500 text-2xl cursor-pointer" title="Delete"
            onClick={() => setIsDeleteModalOpen(true)} />
          </div>
        ),
      },
    ],
    [navigate]
  );

  // Sample data
  const data = useMemo(
    () => [
      {
        student_id: "K001-001-003",
        image: "Picture",
        name: "George Abban",
        gender: "Male",
        class: "Class 2",
      },
      {
        student_id: "K001-001-003",
        image: "Picture",
        name: "George Abban",
        gender: "Male",
        class: "Class 1",
      },
      {
        student_id: "K001-001-003",
        image: "Picture",
        name: "George Abban",
        gender: "Male",
        class: "Class 2",
      },
      {
        student_id: "K001-001-003",
        image: "Picture",
        name: "George Abban",
        gender: "Male",
        class: "Class 2",
      },
      {
        student_id: "K001-001-003",
        image: "Picture",
        name: "George Abban",
        gender: "Male",
        class: "Class 4",
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
          Student List
        </div>
        <CardMenu />
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
                      {row.cells.map((cell, index) => {
                        let content = cell.column.Header === "STUDENT ID" ? (
                          <div className="flex items-center gap-2">
                            <Checkbox />
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                              {cell.value}
                            </p>
                          </div>
                        ) : (
                          cell.render("Cell")
                        );

                        return (
                          <td
                            {...cell.getCellProps()}
                            key={index}
                            className="pt-[14px] pb-[16px] sm:text-[14px]"
                          >
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Render the EditStudent modal */}
      <EditStudent isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      <DeleteStudent isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />

    </TableCard>
  );
};

export default QrcodeTable;
