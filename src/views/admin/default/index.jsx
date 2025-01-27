import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";
import axios from "axios";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";
import AddStudent from "../form/AddStudent";
import { FaUserGraduate, FaCashRegister } from "react-icons/fa";
import { useState, useEffect } from "react";




import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import Absent from "..//..//..//..//src//views//admin//tables//components//Absent";

import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import { FaUser, FaUsers } from "react-icons/fa";
import { MdDeviceHub } from "react-icons/md";
import { jwtDecode } from "jwt-decode";



// Helper function to get school_id from the JWT token
const getSchoolId = () => {
  const userToken = JSON.parse(localStorage.getItem("Edupay"))?.token;
  if (userToken) {
    const decodedToken = jwtDecode(userToken);
    console.log("Decoded school_id:", decodedToken.school_id);
    return decodedToken.school_id;
  }
  return null;
};
// Helper function to encode data (basic obfuscation)
const encodeData = (data) => {
  return btoa(JSON.stringify(data)); // Convert to Base64
};

// Helper function to decode data
const decodeData = (encodedData) => {
  try {
    return JSON.parse(atob(encodedData)); // Decode Base64 back to JSON
  } catch {
    return null; // Return null if decoding fails
  }
};

// Store encoded data in localStorage
const storeDataInLocalStorage = (key, data) => {
  const encodedData = encodeData(data);
  localStorage.setItem(key, encodedData);
};

// Fetch encoded data from localStorage
const getDataFromLocalStorage = (key) => {
  const encodedData = localStorage.getItem(key);
  return encodedData ? decodeData(encodedData) : null;
};

const Dashboard = () => {
  const [studentsCount, setStudentsCount] = useState(null);
  const [terminalsCount, setTerminalsCount] = useState(null);
  const [usersCount, setUsersCount] = useState(null);

  const [dataCounts, setDataCounts] = useState({
    total_students: null,
    total_terminals: null,
    total_users: null,
  });
  
  useEffect(() => {
    const schoolId = getSchoolId();
    if (schoolId) {
      const cachedData = getDataFromLocalStorage(`schoolData_${schoolId}`);

      // If data exists in localStorage, use it
      if (cachedData) {
        setDataCounts(cachedData);
      } else {
        // Otherwise, fetch the data from the API
        const fetchData = async () => {
          try {
            const [studentsResponse, terminalsResponse, usersResponse] = await Promise.all([
              axios.get(`https://edupaygh-backend.onrender.com/fetchstudents/${schoolId}`),
              axios.get(`https://edupaygh-backend.onrender.com/fetchterminal/${schoolId}`),
              axios.get(`https://edupaygh-backend.onrender.com/fetchusers/${schoolId}`),
            ]);

            const fetchedData = {
              total_students: studentsResponse.data.total_students,
              total_terminals: terminalsResponse.data.total_terminals,
              total_users: usersResponse.data.total_users,
            };

            setDataCounts(fetchedData);
            storeDataInLocalStorage(`schoolData_${schoolId}`, fetchedData); // Cache the encoded data
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        fetchData();
      }
    }
  }, []);
  
  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
      <Widget
  icon={<FaUser className="h-7 w-7" />}
  title={"Student"}
  subtitle={dataCounts.total_students !== null ? dataCounts.total_students : "Loading..."}
/>
<Widget
  icon={<FaCashRegister className="h-6 w-6" />}
  title={"Terminals"}
  subtitle={dataCounts.total_terminals !== null ? dataCounts.total_terminals : "Loading..."}
/>
<Widget
  icon={<FaUsers className="h-7 w-7" />}
  title={"Users"}
  subtitle={dataCounts.total_users !== null ? dataCounts.total_users : "Loading..."}
/>

        {/* <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Sample"}
          subtitle={"$1,000"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Sample"}
          subtitle={"145"}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Sample"}
          subtitle={"$2433"}
        /> */}
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        {/* Replacing WeeklyRevenue with CheckTable */}
        <CheckTable
          columnsData={columnsDataCheck}
          tableData={tableDataCheck}
        />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
      <PieChartCard />

        {/* Replacing WeeklyRevenue with CheckTable */}
        <Absent
          columnsData={columnsDataCheck}
          tableData={tableDataCheck}
        />
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        {/* <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div> */}

        {/* Traffic chart & Pie Chart */}

        {/* Traffic chart & Pie Chart */}
{/* <div className="w-full h-full">
  <PieChartCard />
</div> */}

{/* Adding another CheckTable */}
{/* <div className="w-full h-full">
  <CheckTable
    columnsData={columnsDataCheck}
    tableData={tableDataCheck}
  />
</div> */}




        {/* Complex Table , Task & Calendar */}

        {/* <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        /> */}

        {/* Task chart & Calendar */}

        {/* <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div> */}
        {/* AddStudent Form */}
      {/* <div className="mt-5">
        <AddStudent
          label="Student Name"
          id="student-name"
          type="text"
          placeholder="Enter student name"
          variant="auth"
          state="success"
          extra="p-4"
          disabled={false}
        />
      </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
