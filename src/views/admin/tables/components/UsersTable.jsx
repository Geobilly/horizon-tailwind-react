import React, { useMemo, useState, useEffect } from "react";
import UserMenuCard from "components/card/UserMenuCard";
import TableCard from "components/card/EntryTableCard";
// import Checkbox from "components/checkbox";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { AiOutlineCloud, AiOutlineEye, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { MdQrCode } from "react-icons/md";  // Import the Qrcode icon

import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import CircularWithValueLabel from "components/loader/";
import { FiSearch } from "react-icons/fi";
import EditUsers from "../../form/EditUsers";
import DeleteUser from "../../form/DeleteUser";
import ViewEntry from "../../form/ViewEntry";
import PrintCode from "../../form/PrintCode";





const UsersTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to manage EditStudent modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to manage EditStudent modal visibility
  const [isPrintCodeModalOpen, setIsPrintCodeModalOpen] = useState(false); // State to manage EditStudent modal visibility
  const [selectedStudents, setSelectedStudents] = useState([]); // Tracks selected rows
  const [selectedStudentId, setSelectedStudentId] = useState(null); // Track selected student ID

  const handleEditClick = (studentId) => {
    setSelectedStudentId(studentId); // Set the selected student ID
    setIsEditModalOpen(true); // Open the modal
  };

  const handleCheckboxChange = (student, isChecked) => {
    console.log(`Checkbox for student ID ${student.student_id} is ${isChecked ? "checked" : "unchecked"}`);
    setSelectedStudents((prev) =>
      isChecked
        ? [...prev, student] // Add student to the selected list if checked
        : prev.filter((s) => s.student_id !== student.student_id) // Remove student if unchecked
    );
  };
  
  
  
  useEffect(() => {
    console.log("Selected Students:", selectedStudents);
  }, [selectedStudents]); // Log selected students every time it changes
  
  
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

  const handleAction = () => {
    if (selectedStudents.length < 2) {
      alert("Please select more than one student.");
      return;
    }
  
    // Proceed with your action
    console.log("Selected Students:", selectedStudents);
  };

  const columns = useMemo(
    () => [
      {
        Header: " USER ID",
        accessor: "user_id",
        // Cell: ({ row }) => {
        //   const student = row.original;
        //   const isChecked = selectedStudents.some(
        //     (s) => s.student_id === student.student_id
        //   );

        //   return (
        //     <div className="flex items-center gap-2">
        //       <input
        //         type="checkbox"
        //         checked={isChecked}
        //         onChange={(e) => handleCheckboxChange(student, e.target.checked)}
        //         className="checkbox-style"
        //       />
        //       <p className="text-sm font-bold text-navy-700 dark:text-white">
        //         {student.student_id}
        //       </p>
        //     </div>
        //   );
        // },
      },
    //   { Header: "IMAGE", accessor: "image" },
      { Header: "NAME", accessor: "name" },
      { Header: "GENDER", accessor: "gender" },
      { Header: "ROLE", accessor: "role" },
      { Header: "CONTACT", accessor: "contact" },

      {
        Header: "ACTION",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {/* <AiOutlineEye
              className="text-blue-500 text-2xl cursor-pointer"
              title="View"
            //   onClick={() => navigate("/admin/profile")}
            /> */}
            <AiOutlineEdit
              className="text-yellow-500 text-2xl cursor-pointer"
              title="Edit"
              onClick={() => setIsEditModalOpen(true)}
            />
            <AiOutlineDelete
              className="text-red-500 text-2xl cursor-pointer"
              title="Delete"
              onClick={() => setIsDeleteModalOpen(true)}
            />
            {/* <MdQrCode
              className="text-blue-500 text-2xl cursor-pointer"
              title="Print Qrcode"
              onClick={() => setIsPrintCodeModalOpen(true)}
            /> */}
          </div>
        ),
      },
    ],
    [navigate, selectedStudents]
  );
  

  // Sample data
  const data = useMemo(
    () => [
      {
        user_id: "K001",
        // image: "Picture",
        name: "George Abban",
        gender: "Male",
        role: "Admin",
        contact: "+2330543370183",

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
          Users
        </div>
        <UserMenuCard />
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
      const student = row.original;
      // Check if this student is selected
      const isChecked = selectedStudents.some(s => s.student_id === student.student_id);

      return (
        <tr {...row.getRowProps()} key={index}>
          {row.cells.map((cell, index) => {
            let content = cell.column.Header === "STUDENT ID" ? (
              <div className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={isChecked}
    onChange={(e) => handleCheckboxChange(student, e.target.checked)}
    className="checkbox-style w-3 h-3 rounded-full border border-navy-700" // Rounded and with a border
  />
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
        {/* <div>
  <h4 className="text-lg font-bold text-navy-700 dark:text-white">
    Selected Students:
  </h4>
  <ul className="list-disc pl-5 text-sm text-navy-700 dark:text-white">
    {selectedStudents.length > 0 ? (
      selectedStudents.map((student) => (
        <li key={student.student_id}>
          {student.student_id} - {student.name}
        </li>
      ))
    ) : (
      <p className="italic text-gray-500">No students selected.</p>
    )}
  </ul>
</div> */}


      </div>

      {/* Render the EditStudent modal */}
      <EditUsers
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        studentId={selectedStudentId} // Pass studentId as a prop
      />
      <DeleteUser isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
      <PrintCode isOpen={isPrintCodeModalOpen} onClose={() => setIsPrintCodeModalOpen(false)} />



    </TableCard>
  );
};

export default UsersTable;
