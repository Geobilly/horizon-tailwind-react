import React, { useMemo, useState, useEffect } from "react";
import PlayerCardMenu from "components/card/PlayerCardMenu";
import { jwtDecode } from "jwt-decode"; // Use named import
import { AiOutlineExclamationCircle } from "react-icons/ai"; // Import the icon for "No Data"
import { AiOutlineReload } from "react-icons/ai";



import TableCard from "components/card/EntryTableCard";
import axios from "axios";

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
import EditStudent from "../../form/EditStudent";
import EditPlayer from "../../form/EditPlayer";

import DeletePlayer from "../../form/DeletePlayer";

import ViewPlayer from "../../form/ViewPlayer";

import ViewEntry from "../../form/ViewEntry";
import PrintCode from "../../form/PrintCode";
import Spinner from "../../form/Spinner"; // Import the Spinner component






const PlayersTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to manage EditStudent modal visibility
  const [isEditPlayerModalOpen, setIsEditPlayerModalOpen] = useState(false); // State to manage EditStudent modal visibility

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to manage EditStudent modal visibility
  const [isViewPlayerModalOpen, setIsViewPlayerModalOpen] = useState(false); // State to manage EditStudent modal visibility
  const [isPrintCodeModalOpen, setIsPrintCodeModalOpen] = useState(false); // State to manage EditStudent modal visibility
  const [selectedStudents, setSelectedStudents] = useState([]); // Tracks selected rows
  const [selectedStudentId, setSelectedStudentId] = useState(null); // Track selected student ID
  const [hasError, setHasError] = useState(false); // Track API error state
  const [dataLoaded, setDataLoaded] = useState(false); // Track whether data has been loaded
  const [isViewPlayerOpen, setIsViewPlayerOpen] = useState(false);
const [selectedPlayerId, setSelectedPlayerId] = useState(null);
const [selectedPlayerData, setSelectedPlayerData] = useState(null);



  

const fetchPlayerData = async () => {
  try {
    const response = await axios.get("https://ksa.kempshotsportsacademy.com/fetchplayers");
    console.log("API Response Data:", response.data);

    const formattedPlayers = response.data.map((player) => ({
      ...player,
      image: player.photo
        ? `data:image/jpeg;base64,${player.photo}` // Ensure this is a valid base64 image URL
        : "https://via.placeholder.com/150", // Fallback for missing images
    }));
// Sort the players by `id` in descending order
const sortedPlayers = formattedPlayers.sort((a, b) => b.id - a.id);
return sortedPlayers;

    return formattedPlayers;
  } catch (error) {
    console.error("Error fetching player data:", error);
    return [];
  }
};

  

  
  const handleViewClick = (player) => {
    setSelectedPlayerData(player); // Set the selected player's data
    setIsViewPlayerModalOpen(true); // Open the modal
  };
  

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setHasError(false);
  
      try {
        const players = await fetchPlayerData();
        if (players.length > 0) {
          setFilteredData(players);
        } else {
          setFilteredData([]);
          setHasError(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setFilteredData([]);
        setHasError(true);
      } finally {
        setIsLoading(false);
        setDataLoaded(true);
      }
    };
  
    fetchData();
  }, []);
  
  
  
  
  
  

  const handleEditClick = (studentId) => {
    setSelectedStudentId(studentId); // Set the selected student ID
    setIsEditModalOpen(true); // Open the modal
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

  const getSchoolIDFromToken = () => {
    const tokenData = localStorage.getItem("Edupay");
    if (tokenData) {
      try {
        const { token } = JSON.parse(tokenData); // Parse the stored object to extract the token
        const decodedToken = jwtDecode(token); // Use the correct function from jwt-decode
        return decodedToken.school_id; // Assuming "role" is a field in your token payload
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    return null;
  };
  const school_id = getSchoolIDFromToken();


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
  
      const results = filteredData.filter((row) =>
        Object.values(row).some((value) =>
          value != null && value.toString().toLowerCase().includes(lowerCaseQuery) // Check for null or undefined
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
        Header: "PLAYER ID",
        accessor: "id",
        Cell: ({ row }) => {
          const player = row.original;
          const isChecked = selectedStudents.some(
            (p) => p.id === player.id
          );
  
          return (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleCheckboxChange(player, e.target.checked)}
                className="checkbox-style"
              />
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {player.id}
              </p>
            </div>
          );
        },
      },
      {
        Header: "IMAGE",
        accessor: "image",
        Cell: ({ value }) => (
          value ? (
            <img
              src={value} // The src will directly accept the base64 data URL
              alt="Player"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
          )
        ),
      },
      
      
      { Header: "NAME", accessor: "full_name" },
      { Header: "LOCATION", accessor: "location" },
      { Header: "AGE", accessor: "age" },
      {
        Header: "ACTION",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <AiOutlineEye
              className="text-blue-500 text-2xl cursor-pointer"
              title="View"
              onClick={() => handleViewClick(row.original)} // Pass the entire row data
            />
            {role !== "accountant" && role !== "teacher" && (
              <>
                <AiOutlineEdit
                  className="text-yellow-500 text-2xl cursor-pointer"
                  title="Edit"
                  // onClick={() => setIsEditPlayerModalOpen(true)}
                />
                <AiOutlineDelete
                  className="text-red-500 text-2xl cursor-pointer"
                  title="Delete"
                  onClick={() => setIsDeleteModalOpen(true)}
                />
              </>
            )}
          </div>
        ),
      },
      
    ],
    [navigate, selectedStudents]
  );
  

  // Sample data
  const data = useMemo(
    () => [
      // {
      //   student_id: "K001-001-001",
      //   image: "Picture",
      //   name: "George Abban",
      //   gender: "Male",
      //   class: "Class 2",
      // },
      // {
      //   student_id: "K001-001-002",
      //   image: "Picture",
      //   name: "John Doe",
      //   gender: "Male",
      //   class: "Class 1",
      // },
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
    <div className="text-xl font-bold text-navy-700 dark:text-white">Players</div>
    <PlayerCardMenu />
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
    
    <p className="pl-3 pr-2 text-xl cursor-pointer" onClick={() => window.location.reload()}>
      <AiOutlineReload className="h-4 w-4 text-gray-400 dark:text-white" title="Refresh" />
    </p>
  </div>
</div>

<div className="mt-8" style={{ height: "60vh", overflowY: "auto" }}>
  {isLoading ? (
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
  {isLoading ? ( // Show spinner while loading
    <tr>
      <td colSpan={columns.length} className="flex justify-center items-center py-4">
        <Spinner />
      </td>
    </tr>
  ) : hasError ? ( // Show error only if the API response indicates an error
    <tr>
      <td colSpan={columns.length} className="flex justify-center items-center py-4">
        <div className="flex items-center">
          <AiOutlineExclamationCircle className="text-4xl text-red-500" />
          <span className="ml-2 text-lg text-gray-600">No Data Available</span>
        </div>
      </td>
    </tr>
  ) : filteredData.length === 0 ? ( // Show "No Data Found" only when data is empty and no error occurred
    <tr>
      <td colSpan={columns.length} className="flex justify-center items-center py-4">
        <div className="flex items-center">
          <AiOutlineExclamationCircle className="text-4xl text-red-500" />
          <span className="ml-2 text-lg text-gray-600">No Data Found</span>
        </div>
      </td>
    </tr>
  ) : (
    page.map((row) => {
      prepareRow(row);
      return (
        <tr {...row.getRowProps()}>
          {row.cells.map((cell) => (
            <td {...cell.getCellProps()} className="pt-[14px] pb-[16px] sm:text-[14px]">
              {cell.render("Cell")}
            </td>
          ))}
        </tr>
      );
    })
  )}
</tbody>

    </table>
  ) : hasError ? (
    <div className="flex justify-center items-center">
      <AiOutlineExclamationCircle className="text-4xl text-red-500 justify-center items-center" /> {/* No Data Icon */}
      <span className="ml-2 text-lg text-gray-600">No Data Available</span>
    </div>
  ) : filteredData.length === 0 ? ( // Check if the filtered data is empty
    <div className="flex justify-center items-center">
      <AiOutlineExclamationCircle className="text-4xl text-red-500" /> {/* No Data Found Icon */}
      <span className="ml-2 text-lg text-gray-600">No Data Found</span>
    </div>
  ) : (
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
                <td {...cell.getCellProps()} className="pt-[14px] pb-[16px] sm:text-[14px]">
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  )}
</div>








  <EditStudent
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    studentId={selectedStudentId}
  />
  <EditPlayer
    isOpen={isEditPlayerModalOpen}
    onClose={() => setIsEditPlayerModalOpen(false)}
    // studentId={selectedStudentId}
  />
  <DeletePlayer
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
  />
  <PrintCode
    isOpen={isPrintCodeModalOpen}
    onClose={() => setIsPrintCodeModalOpen(false)}
  />
  <ViewPlayer
  isOpen={isViewPlayerModalOpen}
  onClose={() => setIsViewPlayerModalOpen(false)}
  playerData={selectedPlayerData} // Pass the selected player's data
/>

</TableCard>



);
};

export default PlayersTable;