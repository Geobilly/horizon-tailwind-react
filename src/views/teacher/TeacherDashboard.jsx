import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "components/card";
import Widget from "components/widget/Widget";
import { FaChalkboardTeacher, FaUserGraduate, FaBook, FaCalendarAlt, FaHandWave } from "react-icons/fa";
import { MdAssignment, MdGrade, MdPayments, MdPendingActions, MdAdd, MdPersonAdd, MdPayment, MdWavingHand } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import CircularWithValueLabel from "components/loader/index";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalClasses: 5,
    totalAssignments: 12,
    totalPendingDebt: 0,
    upcomingClasses: [
      { className: "Class 5", date: "2024-03-20" },
      { className: "Class 4", date: "2024-03-21" }
    ],
    recentGrades: [],
    attendanceData: {},
    performanceData: {},
    students: [],
    pendingPayments: [
      {
        id: "PAY001",
        terminal: "Bus Fees",
        date: "2024-03-15",
        numberOfStudents: 25,
        total: 2500.00,
        status: "Pending"
      },
      {
        id: "PAY002",
        terminal: "Canteen Fees",
        date: "2024-03-14",
        numberOfStudents: 30,
        total: 3000.00,
        status: "Pending"
      },
      {
        id: "PAY003",
        terminal: "Bus Fees",
        date: "2024-03-13",
        numberOfStudents: 20,
        total: 2000.00,
        status: "Pending"
      },
      {
        id: "PAY004",
        terminal: "Canteen Fees",
        date: "2024-03-12",
        numberOfStudents: 28,
        total: 2800.00,
        status: "Pending"
      },
      {
        id: "PAY005",
        terminal: "Bus Fees",
        date: "2024-03-11",
        numberOfStudents: 22,
        total: 2200.00,
        status: "Pending"
      }
    ],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Add new state for search and pagination
  const [dailyPaymentsSearch, setDailyPaymentsSearch] = useState('');
  const [debtRecordsSearch, setDebtRecordsSearch] = useState('');
  const [dailyPaymentsPage, setDailyPaymentsPage] = useState(1);
  const [debtRecordsPage, setDebtRecordsPage] = useState(1);
  const itemsPerPage = 5;

  // Add date filter states
  const [dailyPaymentsDateRange, setDailyPaymentsDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [debtRecordsDateRange, setDebtRecordsDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem("Edupay"))?.user;
    return userData || null;
  };

  const getTeacherId = () => {
    const userToken = JSON.parse(localStorage.getItem("Edupay"))?.token;
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      return decodedToken.teacher_id;
    }
    return null;
  };

  const fetchDashboardData = async () => {
    const userData = getUserData();
    if (!userData) return;

    setIsLoading(true);
    try {
      // Make direct API request for students
      const apiUrl = `https://edupaygh-backend.onrender.com/fetchstudents/K-001/${userData.classlevel}`;
      console.log('Fetching students from:', apiUrl);

      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('API Response:', data);

      // Get unique student_ids
      const uniqueStudentIds = new Set(data.students.map(student => student.student_id));
      const totalStudents = uniqueStudentIds.size;
      console.log('Unique Student IDs:', Array.from(uniqueStudentIds));
      console.log('Total Unique Students:', totalStudents);

      // Fetch credit students data
      const creditApiUrl = `https://edupaygh-backend.onrender.com/fetchallcreditstudentswithclass/K-001/${userData.classlevel}`;
      const creditResponse = await fetch(creditApiUrl);
      const creditData = await creditResponse.json();
      
      // Calculate total debt from unpaid credits
      const totalDebt = creditData.students
        .filter(student => student.status === 'not paid')
        .reduce((sum, student) => sum + parseFloat(student.terminal_price), 0);

      // Calculate total pending debt
      const totalPendingDebt = creditData.students
        .filter(student => student.status === 'pending')
        .reduce((sum, student) => sum + parseFloat(student.terminal_price), 0);

      // Filter out paid status records for debt records table
      const filteredDebtRecords = creditData.students.filter(student => student.status !== 'paid');

      // Fetch entries data
      const entriesApiUrl = `https://edupaygh-backend.onrender.com/fetchentries/K-001/${userData.classlevel}`;
      const entriesResponse = await fetch(entriesApiUrl);
      const entriesData = await entriesResponse.json();

      // Filter only pending entries
      const pendingEntries = entriesData.entries.filter(entry => entry.status === 'Pending');

      // Update dashboard data
      setDashboardData(prevData => ({
        ...prevData,
        totalStudents: totalStudents,
        students: filteredDebtRecords || [], // Use filtered debt records
        totalClasses: totalDebt.toFixed(2), // Using totalClasses field to store total debt
        totalPendingDebt: totalPendingDebt.toFixed(2), // Store pending debt
        pendingPayments: pendingEntries.map(entry => ({
          id: entry.entry_id,
          terminal: entry.terminal,
          date: entry.time,
          total: parseFloat(entry.total_amount),
          status: entry.status
        })),
        // Keep other data unchanged
        totalAssignments: prevData.totalAssignments,
        upcomingClasses: prevData.upcomingClasses,
        recentGrades: prevData.recentGrades,
        attendanceData: prevData.attendanceData,
        performanceData: prevData.performanceData,
      }));

    } catch (error) {
      console.error("Error fetching data:", error);
      setDashboardData(prevData => ({
        ...prevData,
        totalStudents: 0,
        students: [],
        totalClasses: '0.00',
        totalPendingDebt: '0.00',
        pendingPayments: []
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Process attendance data
  const processAttendanceData = (students = []) => {
    if (!Array.isArray(students)) {
      console.log('Invalid students data for attendance:', students);
      return { labels: [], data: [] };
    }

    const attendanceByClass = students.reduce((acc, student) => {
      acc[student.class] = (acc[student.class] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(attendanceByClass),
      data: Object.values(attendanceByClass),
    };
  };

  // Process performance data
  const processPerformanceData = (assignments = []) => {
    const performanceBySubject = assignments.reduce((acc, assignment) => {
      acc[assignment.subject] = (acc[assignment.subject] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(performanceBySubject),
      data: Object.values(performanceBySubject),
    };
  };

  // Chart configurations
  const attendanceChartConfig = {
    labels: dashboardData.attendanceData.labels,
    datasets: [{
      label: 'Students per Class',
      data: dashboardData.attendanceData.data,
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  const performanceChartConfig = {
    labels: dashboardData.performanceData.labels,
    datasets: [{
      label: 'Assignments by Subject',
      data: dashboardData.performanceData.data,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Update filterAndPaginateData function to include date filtering
  const filterAndPaginateData = (data, searchTerm, page, dateRange) => {
    const filteredData = data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const searchMatch = Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchLower)
      );

      // Date filtering
      let dateMatch = true;
      if (dateRange.startDate && dateRange.endDate) {
        const itemDate = new Date(item.date || item.time);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999); // Set to end of day
        dateMatch = itemDate >= startDate && itemDate <= endDate;
      }

      return searchMatch && dateMatch;
    });

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return {
      data: paginatedData,
      totalPages,
      totalItems: filteredData.length
    };
  };

  // Add clear filter functions
  const clearDailyPaymentsFilters = () => {
    setDailyPaymentsSearch('');
    setDailyPaymentsDateRange({ startDate: '', endDate: '' });
    setDailyPaymentsPage(1);
  };

  const clearDebtRecordsFilters = () => {
    setDebtRecordsSearch('');
    setDebtRecordsDateRange({ startDate: '', endDate: '' });
    setDebtRecordsPage(1);
  };

  if (isLoading) {
    return (
      <div className="mt-3 p-4 min-h-screen bg-gray-100 dark:bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <CircularWithValueLabel size={60} />
          <p className="mt-4 text-navy-700 dark:text-white">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 p-4 min-h-screen bg-gray-100 dark:bg-navy-900 relative">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white">Teacher Dashboard</h1>
        <div className="flex items-center space-x-2 mt-1">
          <p className="text-gray-600 dark:text-gray-400">Welcome</p>
          <span className="text-2xl animate-bounce">👋</span>
          <p className="text-gray-600 dark:text-gray-400"><span className="font-semibold text-brand-500">{getUserData()?.name || 'Teacher'}</span></p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Widget
            icon={<FaUserGraduate className="h-7 w-7" />}
            title="Total Students"
            subtitle={dashboardData.totalStudents}
          />
        </div>
        <div>
          <Widget
            icon={<MdPayments className="h-7 w-7" />}
            title="Total Unpaid Debt"
            subtitle={`GH₵ ${dashboardData.totalClasses}`}
          />
        </div>
        <div>
          <Widget
            icon={<MdPendingActions className="h-7 w-7" />}
            title="Total Paid Debt (Pending)"
            subtitle={`GH₵ ${dashboardData.totalPendingDebt}`}
          />
        </div>
        <div>
          <Widget
            icon={<FaChalkboardTeacher className="h-7 w-7" />}
            title="Class Name"
            subtitle={getUserData()?.classlevel || 'No Class'}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-1">
        {/* Daily Fees Payments Table */}
        <Card className="bg-white dark:bg-navy-800 shadow-lg">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4">
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Daily Fees Payments
              </h4>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <input
                    type="date"
                    value={dailyPaymentsDateRange.startDate}
                    onChange={(e) => setDailyPaymentsDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="text-gray-500 hidden sm:inline">to</span>
                  <input
                    type="date"
                    value={dailyPaymentsDateRange.endDate}
                    onChange={(e) => setDailyPaymentsDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={dailyPaymentsSearch}
                    onChange={(e) => setDailyPaymentsSearch(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button
                  onClick={clearDailyPaymentsFilters}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-600 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-navy-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Entry ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Terminal</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Date</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Total</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterAndPaginateData(dashboardData.pendingPayments || [], dailyPaymentsSearch, dailyPaymentsPage, dailyPaymentsDateRange).data.map((payment, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-gray-100 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-navy-700 dark:text-white whitespace-nowrap">
                          <span className="font-medium">#{payment.id}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-navy-700 dark:text-white whitespace-nowrap">{payment.terminal}</td>
                        <td className="py-3 px-4 text-sm text-navy-700 dark:text-white whitespace-nowrap">{payment.date || 'N/A'}</td>
                        <td className="py-3 px-4 text-sm text-right whitespace-nowrap">
                          <span className="font-medium text-red-500">GH₵ {payment.total?.toFixed(2)}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-center whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              payment.status === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pagination for Daily Fees Payments */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((dailyPaymentsPage - 1) * itemsPerPage) + 1} to {Math.min(dailyPaymentsPage * itemsPerPage, filterAndPaginateData(dashboardData.pendingPayments || [], dailyPaymentsSearch, dailyPaymentsPage, dailyPaymentsDateRange).totalItems)} of {filterAndPaginateData(dashboardData.pendingPayments || [], dailyPaymentsSearch, dailyPaymentsPage, dailyPaymentsDateRange).totalItems} entries
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setDailyPaymentsPage(prev => Math.max(prev - 1, 1))}
                  disabled={dailyPaymentsPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setDailyPaymentsPage(prev => Math.min(prev + 1, filterAndPaginateData(dashboardData.pendingPayments || [], dailyPaymentsSearch, dailyPaymentsPage, dailyPaymentsDateRange).totalPages))}
                  disabled={dailyPaymentsPage === filterAndPaginateData(dashboardData.pendingPayments || [], dailyPaymentsSearch, dailyPaymentsPage, dailyPaymentsDateRange).totalPages}
                  className="px-3 py-1 rounded-md bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Debt Records Table */}
        <Card className="bg-white dark:bg-navy-800 shadow-lg mt-8">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4">
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Debt Records
              </h4>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <input
                    type="date"
                    value={debtRecordsDateRange.startDate}
                    onChange={(e) => setDebtRecordsDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="text-gray-500 hidden sm:inline">to</span>
                  <input
                    type="date"
                    value={debtRecordsDateRange.endDate}
                    onChange={(e) => setDebtRecordsDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search debt records..."
                    value={debtRecordsSearch}
                    onChange={(e) => setDebtRecordsSearch(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button
                  onClick={clearDebtRecordsFilters}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-600 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-navy-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Student ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Terminal</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Date</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Amount</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterAndPaginateData(dashboardData.students || [], debtRecordsSearch, debtRecordsPage, debtRecordsDateRange).data.map((student, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-gray-100 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-navy-700 dark:text-white whitespace-nowrap">
                          <span className="font-medium">{student.stu_id}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-navy-700 dark:text-white whitespace-nowrap">{student.name}</td>
                        <td className="py-3 px-4 text-sm text-navy-700 dark:text-white whitespace-nowrap">{student.terminal}</td>
                        <td className="py-3 px-4 text-sm text-navy-700 dark:text-white whitespace-nowrap">{student.date || 'N/A'}</td>
                        <td className="py-3 px-4 text-sm text-right whitespace-nowrap">
                          <span className="font-medium text-red-500">GH₵ {student.terminal_price}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-center whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${student.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              student.status === 'not paid' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pagination for Debt Records */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((debtRecordsPage - 1) * itemsPerPage) + 1} to {Math.min(debtRecordsPage * itemsPerPage, filterAndPaginateData(dashboardData.students || [], debtRecordsSearch, debtRecordsPage, debtRecordsDateRange).totalItems)} of {filterAndPaginateData(dashboardData.students || [], debtRecordsSearch, debtRecordsPage, debtRecordsDateRange).totalItems} entries
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setDebtRecordsPage(prev => Math.max(prev - 1, 1))}
                  disabled={debtRecordsPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setDebtRecordsPage(prev => Math.min(prev + 1, filterAndPaginateData(dashboardData.students || [], debtRecordsSearch, debtRecordsPage, debtRecordsDateRange).totalPages))}
                  disabled={debtRecordsPage === filterAndPaginateData(dashboardData.students || [], debtRecordsSearch, debtRecordsPage, debtRecordsDateRange).totalPages}
                  className="px-3 py-1 rounded-md bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 flex items-center justify-center"
          onClick={toggleModal}
        >
          <div 
            className="bg-white/95 dark:bg-navy-800/95 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-navy-700 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigate('/admin/pay-debt');
                    setIsModalOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg flex items-center transition-colors duration-200"
                >
                  <div className="h-10 w-10 rounded-full bg-brand-500/10 flex items-center justify-center mr-3">
                    <MdPayments className="h-5 w-5 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-medium">Pay Debt</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Record a debt payment for a student</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigate('/admin/record-payment');
                    setIsModalOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg flex items-center transition-colors duration-200"
                >
                  <div className="h-10 w-10 rounded-full bg-brand-500/10 flex items-center justify-center mr-3">
                    <MdPayment className="h-5 w-5 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-medium">Record Payment</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Add a new payment record</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={toggleModal}
          className={`w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-lg flex items-center justify-center transform transition-all duration-200 ease-in-out ${
            isModalOpen ? 'rotate-45' : 'rotate-0'
          }`}
        >
          <MdAdd className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

export default TeacherDashboard; 