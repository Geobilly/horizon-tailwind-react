import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
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

const NewDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalPayments: 0,
    totalPermissions: 0,
    recentPayments: [],
    paymentTrends: [],
    permissionsByClass: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  const getSchoolId = () => {
    const userToken = JSON.parse(localStorage.getItem("Edupay"))?.token;
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      return decodedToken.school_id;
    }
    return null;
  };

  const fetchDashboardData = async () => {
    const schoolId = getSchoolId();
    if (!schoolId) return;

    setIsLoading(true);
    try {
      // Fetch all required data in parallel
      const [studentsRes, paymentsRes, permissionsRes] = await Promise.all([
        fetch(`https://edupaygh-backend.onrender.com/fetchstudents/${schoolId}`),
        fetch(`https://edupaygh-backend.onrender.com/fetchpayments/${schoolId}`),
        fetch(`https://edupaygh-backend.onrender.com/getpermissions/${schoolId}`)
      ]);

      const [studentsData, paymentsData, permissionsData] = await Promise.all([
        studentsRes.json(),
        paymentsRes.json(),
        permissionsRes.json()
      ]);

      // Process and set dashboard data
      setDashboardData({
        totalStudents: studentsData.students?.length || 0,
        totalPayments: paymentsData.payments?.length || 0,
        totalPermissions: permissionsData.permissions?.length || 0,
        recentPayments: paymentsData.payments?.slice(0, 5) || [],
        paymentTrends: processPaymentTrends(paymentsData.payments),
        permissionsByClass: processPermissionsByClass(permissionsData.permissions),
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Process payment data for trends
  const processPaymentTrends = (payments = []) => {
    // Group payments by date and calculate daily totals
    const dailyTotals = payments.reduce((acc, payment) => {
      const date = new Date(payment.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + Number(payment.amount);
      return acc;
    }, {});

    return {
      labels: Object.keys(dailyTotals),
      data: Object.values(dailyTotals),
    };
  };

  // Process permissions data by class
  const processPermissionsByClass = (permissions = []) => {
    return permissions.reduce((acc, permission) => {
      acc[permission.class] = (acc[permission.class] || 0) + 1;
      return acc;
    }, {});
  };

  // Chart configurations
  const paymentTrendConfig = {
    labels: dashboardData.paymentTrends.labels,
    datasets: [{
      label: 'Daily Payments',
      data: dashboardData.paymentTrends.data,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const permissionsChartConfig = {
    labels: Object.keys(dashboardData.permissionsByClass),
    datasets: [{
      data: Object.values(dashboardData.permissionsByClass),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  return (
    <div className="mt-3 p-4 min-h-screen bg-gray-100 dark:bg-navy-900">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white">Analytics Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track your school's key metrics and performance</p>
      </div>

      {/* Stats Cards with improved styling */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white dark:bg-navy-800 shadow-lg transform hover:scale-105 transition-transform duration-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-white">
                  Total Students
                </Typography>
                <Typography variant="h3" className="font-bold text-3xl text-navy-700 dark:text-white">
                  {dashboardData.totalStudents}
                </Typography>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white dark:bg-navy-800 shadow-lg transform hover:scale-105 transition-transform duration-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-white">
                  Total Payments
                </Typography>
                <Typography variant="h3" className="font-bold text-3xl text-navy-700 dark:text-white">
                  {dashboardData.totalPayments}
                </Typography>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white dark:bg-navy-800 shadow-lg transform hover:scale-105 transition-transform duration-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-white">
                  Total Permissions
                </Typography>
                <Typography variant="h3" className="font-bold text-3xl text-navy-700 dark:text-white">
                  {dashboardData.totalPermissions}
                </Typography>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts Section with improved responsiveness */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="bg-white dark:bg-navy-800 shadow-lg">
          <CardBody className="p-6">
            <Typography variant="h5" color="blue-gray" className="mb-4 dark:text-white">
              Payment Trends
            </Typography>
            <div className="h-[400px] w-full">
              <Line 
                data={paymentTrendConfig} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: 'rgb(156, 163, 175)'
                      }
                    }
                  },
                  scales: {
                    y: {
                      ticks: { color: 'rgb(156, 163, 175)' }
                    },
                    x: {
                      ticks: { color: 'rgb(156, 163, 175)' }
                    }
                  }
                }} 
              />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white dark:bg-navy-800 shadow-lg">
          <CardBody className="p-6">
            <Typography variant="h5" color="blue-gray" className="mb-4 dark:text-white">
              Permissions by Class
            </Typography>
            <div className="h-[400px] w-full">
              <Doughnut 
                data={permissionsChartConfig} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: 'rgb(156, 163, 175)'
                      }
                    }
                  }
                }} 
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Payments Table with improved styling */}
      <Card className="bg-white dark:bg-navy-800 shadow-lg">
        <CardBody className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h5" color="blue-gray" className="dark:text-white">
              Recent Payments
            </Typography>
            <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto">
              <thead>
                <tr>
                  {["Student", "Amount", "Date", "Status"].map((head) => (
                    <th key={head} className="border-b border-gray-200 dark:border-navy-700 p-4">
                      <Typography variant="small" className="font-semibold text-gray-600 dark:text-gray-400">
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentPayments.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-navy-700">
                    <td className="p-4">
                      <Typography variant="small" className="font-medium text-navy-700 dark:text-white">
                        {payment.student_name}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="font-medium text-navy-700 dark:text-white">
                        GH₵ {payment.amount}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="font-medium text-navy-700 dark:text-white">
                        {new Date(payment.date).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default NewDashboard; 