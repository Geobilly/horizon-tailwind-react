import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import TotalOwing from "views/admin/default/components/TotalOwing";
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [dataCounts, setDataCounts] = useState({
    total_students: 0,
    total_terminals: 0,
    total_users: 0,
    total_permissions: 0,
    total_number_credit: 0,
    total_amount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const schoolId = getSchoolId();
    if (!schoolId) return;

    // First load cached data
    const cachedData = getDataFromLocalStorage(`schoolData_${schoolId}`);
    if (cachedData) {
      setDataCounts(cachedData);
    }
  
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [studentsResponse, terminalsResponse, usersResponse, permissionsResponse, creditResponse] = await Promise.all([
          axios.get(`https://edupaygh-backend.onrender.com/fetchstudents/${schoolId}`),
          axios.get(`https://edupaygh-backend.onrender.com/fetchterminal/${schoolId}`),
          axios.get(`https://edupaygh-backend.onrender.com/fetchusers/${schoolId}`),
          axios.get(`http://127.0.0.1:5000/getpermissions/${schoolId}`),
          axios.get(`http://127.0.0.1:5000/fetchcreditstudents/${schoolId}`),
        ]);
  
        const fetchedData = {
          total_students: studentsResponse.data?.total_students ?? dataCounts.total_students,
          total_terminals: terminalsResponse.data?.total_terminals ?? dataCounts.total_terminals,
          total_users: usersResponse.data?.total_users ?? dataCounts.total_users,
          total_permissions: permissionsResponse.data?.total_permissions ?? dataCounts.total_permissions,
          total_number_credit: creditResponse.data?.total_number_credit ?? dataCounts.total_number_credit,
          total_amount: creditResponse.data?.total_amount ?? dataCounts.total_amount,
        };
  
        setDataCounts(prevData => ({
          ...prevData,
          ...fetchedData
        }));
        storeDataInLocalStorage(`schoolData_${schoolId}`, fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Keep existing data on error
      } finally {
        setIsLoading(false);
      }
    };
  
    // Fetch data initially
    fetchData();
  
    // Set interval to refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000);
  
    return () => clearInterval(interval);
  }, []);
  
  // Helper function to format currency
  const formatCurrency = (amount) => {
    return typeof amount === 'number' ? `₵${amount.toFixed(2)}` : '₵0.00';
  };

  // Helper function to format number
  const formatNumber = (num) => {
    return typeof num === 'number' ? num : 0;
  };
  
  return (
    <div>
      {/* Card widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <div 
          onClick={() => navigate('/admin/student')}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <Widget 
            icon={<FaUser className="h-7 w-7" />} 
            title={"Student"} 
            subtitle={formatNumber(dataCounts.total_students)} 
          />
        </div>
        <div 
          onClick={() => navigate('/admin/terminal')}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <Widget 
            icon={<FaCashRegister className="h-6 w-6" />} 
            title={"Terminals"} 
            subtitle={formatNumber(dataCounts.total_terminals)} 
          />
        </div>
        <div 
          onClick={() => navigate('/admin/student')}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <Widget 
            icon={<FaUsers className="h-7 w-7" />} 
            title={"Users"} 
            subtitle={formatNumber(dataCounts.total_users)} 
          />
        </div>
        <div 
          onClick={() => navigate('/admin/permission')}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <Widget 
            icon={<FaUsers className="h-7 w-7" />} 
            title={"Permitted"} 
            subtitle={formatNumber(dataCounts.total_permissions)} 
          />
        </div>
        <div 
          onClick={() => navigate('/admin/credit')}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <Widget 
            icon={<FaUsers className="h-7 w-7" />} 
            title={"Number Owing"} 
            subtitle={formatNumber(dataCounts.total_number_credit)} 
          />
        </div>
        <div 
          onClick={() => navigate('/admin/credit')}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <Widget 
            icon={<FaUsers className="h-7 w-7" />} 
            title={"Owing Amount"} 
            subtitle={formatCurrency(dataCounts.total_amount)} 
          />
        </div>
      </div>

      {/* Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <TotalOwing />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 h-full">
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
      </div>
    </div>
  );
};

export default Dashboard;
