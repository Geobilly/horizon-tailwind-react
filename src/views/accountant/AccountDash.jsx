import React, { useState, useMemo, useEffect } from "react";
import Card from "components/card";
import Widget from "components/widget/Widget";
import { MdAttachMoney, MdPayments, MdPendingActions, MdTrendingUp, MdTrendingDown, MdCalendarToday, MdFilterList, MdClear, MdChevronLeft, MdChevronRight, MdSearch, MdVisibility } from "react-icons/md";
import { Line, Bar } from 'react-chartjs-2';
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
} from 'chart.js';
import PendingPayments from "./components/PendingPayments";
import DebtPending from "./components/DebtPending";
import axios from "axios";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Sample data moved outside component
const sampleData = {
  totalRevenue: 25000.00,
  totalDebt: 15000.00,
  pendingPayments: 5000.00,
  recentTransactions: [
    {
      id: 1,
      type: "Payment",
      student: "John Doe",
      amount: 500.00,
      date: "2024-03-15",
      status: "Completed",
      terminal: "Bus",
      class: "Class 1"
    },
    {
      id: 2,
      type: "Debt Payment",
      student: "Sarah Smith",
      amount: 750.00,
      date: "2024-03-14",
      status: "Completed",
      terminal: "Canteen",
      class: "Class 6"
    },
    {
      id: 3,
      type: "Payment",
      student: "Michael Brown",
      amount: 300.00,
      date: "2024-03-14",
      status: "Pending",
      terminal: "Bus",
      class: "Class 2"
    },
    {
      id: 4,
      type: "Debt Payment",
      student: "Emma Wilson",
      amount: 1000.00,
      date: "2024-03-13",
      status: "Completed",
      terminal: "Sat. Classes",
      class: "Class 1"
    },
    {
      id: 5,
      type: "Payment",
      student: "David Johnson",
      amount: 450.00,
      date: "2024-03-12",
      status: "Completed",
      terminal: "Canteen",
      class: "Class 6"
    },
    {
      id: 6,
      type: "Debt Payment",
      student: "Lisa Anderson",
      amount: 800.00,
      date: "2024-03-11",
      status: "Pending",
      terminal: "Sat. Classes",
      class: "Class 2"
    },
    {
      id: 7,
      type: "Payment",
      student: "James Wilson",
      amount: 600.00,
      date: "2024-03-10",
      status: "Completed",
      terminal: "Bus",
      class: "Class 1"
    },
    {
      id: 8,
      type: "Debt Payment",
      student: "Maria Garcia",
      amount: 1200.00,
      date: "2024-03-09",
      status: "Completed",
      terminal: "Canteen",
      class: "Class 6"
    },
    {
      id: 9,
      type: "Payment",
      student: "Robert Taylor",
      amount: 350.00,
      date: "2024-03-08",
      status: "Pending",
      terminal: "Bus",
      class: "Class 1"
    },
    {
      id: 10,
      type: "Debt Payment",
      student: "Jennifer Lee",
      amount: 900.00,
      date: "2024-03-07",
      status: "Completed",
      terminal: "Sat. Classes",
      class: "Class 2"
    }
  ],
  monthlyRevenue: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [15000, 18000, 22000, 25000, 23000, 25000]
  },
  paymentTypes: {
    labels: ['Regular Payments', 'Debt Payments', 'Pending'],
    data: [15000, 8000, 5000]
  },
  revenueTrend: {
    daily: {
      labels: Array.from({length: 30}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      bus: Array.from({length: 30}, () => Math.floor(Math.random() * 1000) + 200),
      canteen: Array.from({length: 30}, () => Math.floor(Math.random() * 800) + 150),
      get total() {
        return this.bus.map((busValue, index) => busValue + this.canteen[index]);
      }
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      bus: Array.from({length: 12}, () => Math.floor(Math.random() * 8000) + 2000),
      canteen: Array.from({length: 12}, () => Math.floor(Math.random() * 6000) + 1500),
      get total() {
        return this.bus.map((busValue, index) => busValue + this.canteen[index]);
      }
    },
    yearly: {
      labels: ['2020', '2021', '2022', '2023', '2024'],
      bus: Array.from({length: 5}, () => Math.floor(Math.random() * 50000) + 15000),
      canteen: Array.from({length: 5}, () => Math.floor(Math.random() * 40000) + 10000),
      get total() {
        return this.bus.map((busValue, index) => busValue + this.canteen[index]);
      }
    }
  },
  debtTrend: {
    daily: {
      labels: Array.from({length: 30}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      bus: Array.from({length: 30}, () => Math.floor(Math.random() * 800) + 150),
      canteen: Array.from({length: 30}, () => Math.floor(Math.random() * 600) + 100),
      get total() {
        return this.bus.map((busValue, index) => busValue + this.canteen[index]);
      }
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      bus: Array.from({length: 12}, () => Math.floor(Math.random() * 6000) + 1500),
      canteen: Array.from({length: 12}, () => Math.floor(Math.random() * 4000) + 1000),
      get total() {
        return this.bus.map((busValue, index) => busValue + this.canteen[index]);
      }
    },
    yearly: {
      labels: ['2020', '2021', '2022', '2023', '2024'],
      bus: Array.from({length: 5}, () => Math.floor(Math.random() * 40000) + 10000),
      canteen: Array.from({length: 5}, () => Math.floor(Math.random() * 30000) + 8000),
      get total() {
        return this.bus.map((busValue, index) => busValue + this.canteen[index]);
      }
    }
  }
};

const AccountDash = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [filteredData, setFilteredData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [debtCurrentPage, setDebtCurrentPage] = useState(1);
  const [debtPageSize, setDebtPageSize] = useState(5);
  const [debtSearchQuery, setDebtSearchQuery] = useState("");
  const [revenueTimeRange, setRevenueTimeRange] = useState('daily');
  const [debtTimeRange, setDebtTimeRange] = useState('daily');
  const [apiData, setApiData] = useState(null);
  const [creditData, setCreditData] = useState(null);
  const [entriesData, setEntriesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revenueResponse, creditResponse, entriesResponse] = await Promise.all([
          axios.get('https://edupaygh-backend.onrender.com/fetchreport/K-001'),
          axios.get('https://edupaygh-backend.onrender.com/fetchcreditreport/K-001'),
          axios.get('https://edupaygh-backend.onrender.com/fetchentries/K-001')
        ]);
        setApiData(revenueResponse.data.report);
        setCreditData(creditResponse.data);
        setEntriesData(entriesResponse.data.entries);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process API data for revenue calculations
  const processedRevenueData = useMemo(() => {
    if (!apiData) return null;

    // Group data by date
    const groupedByDate = apiData.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = { bus: 0, canteen: 0 };
      }
      if (item.terminal === 'bus') {
        acc[date].bus += item.totalAmount;
      } else if (item.terminal === 'canteen') {
        acc[date].canteen += item.totalAmount;
      }
      return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(groupedByDate).sort();

    // Calculate totals
    const totalRevenue = apiData.reduce((sum, item) => sum + item.totalAmount, 0);

    return {
      dates: sortedDates,
      busData: sortedDates.map(date => groupedByDate[date].bus),
      canteenData: sortedDates.map(date => groupedByDate[date].canteen),
      totalRevenue
    };
  }, [apiData]);

  // Process credit data for debt calculations
  const processedCreditData = useMemo(() => {
    if (!creditData) return null;

    // Group data by date
    const groupedByDate = creditData.reduce((acc, item) => {
      const date = new Date(item.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { bus: 0, canteen: 0 };
      }
      
      item.terminal.forEach(term => {
        if (term.terminal.toLowerCase() === 'bus') {
          acc[date].bus += term.amount;
        } else if (term.terminal.toLowerCase() === 'canteen') {
          acc[date].canteen += term.amount;
        }
      });
      return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(groupedByDate).sort();

    // Calculate total debt
    const totalDebt = creditData.reduce((sum, item) => sum + item.total, 0);

    return {
      dates: sortedDates,
      busData: sortedDates.map(date => groupedByDate[date].bus),
      canteenData: sortedDates.map(date => groupedByDate[date].canteen),
      totalDebt
    };
  }, [creditData]);

  // Process entries data for pending payments
  const processedEntriesData = useMemo(() => {
    if (!entriesData) return null;

    // Filter entries by date range if filteredData exists
    const filteredEntries = filteredData 
      ? entriesData.filter(entry => {
          const entryDate = new Date(entry.created_at);
          const start = new Date(dateRange.startDate);
          const end = new Date(dateRange.endDate);
          end.setHours(23, 59, 59, 999);
          return entryDate >= start && entryDate <= end;
        })
      : entriesData;

    // Calculate total pending payments by summing total_amount of entries with Pending status
    const totalPendingPayments = filteredEntries
      .filter(entry => entry.status === "Pending")
      .reduce((sum, entry) => sum + entry.total_amount, 0);

    return {
      totalPendingPayments,
      entries: filteredEntries
    };
  }, [entriesData, filteredData, dateRange]);

  const applyFilter = () => {
    if (!apiData || !creditData) return;

    // Filter revenue data
    const filteredRevenueTransactions = apiData.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);
      return transactionDate >= start && transactionDate <= end;
    });

    // Filter credit data
    const filteredCreditTransactions = creditData.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);
      return transactionDate >= start && transactionDate <= end;
    });

    // Calculate revenue totals
    const totalRevenue = filteredRevenueTransactions.reduce((sum, t) => sum + t.totalAmount, 0);

    // Calculate debt totals
    const totalDebt = filteredCreditTransactions.reduce((sum, t) => sum + t.total, 0);

    // Group filtered credit data by date
    const groupedByDate = filteredCreditTransactions.reduce((acc, item) => {
      const date = new Date(item.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { bus: 0, canteen: 0 };
      }
      
      item.terminal.forEach(term => {
        if (term.terminal.toLowerCase() === 'bus') {
          acc[date].bus += term.amount;
        } else if (term.terminal.toLowerCase() === 'canteen') {
          acc[date].canteen += term.amount;
        }
      });
      return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(groupedByDate).sort();

    setFilteredData({
      totalRevenue,
      totalDebt,
      dates: sortedDates,
      busData: sortedDates.map(date => groupedByDate[date].bus),
      canteenData: sortedDates.map(date => groupedByDate[date].canteen),
      recentTransactions: filteredRevenueTransactions
    });
  };

  const handleDateChange = (type, value) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const clearFilter = () => {
    setFilteredData(null);
    setDateRange({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    });
  };

  // Use filtered data if available, otherwise use processed API data
  const displayData = filteredData || processedRevenueData;

  // Updated chart configurations
  const revenueChartConfig = {
    labels: displayData?.dates || [],
    datasets: [
      {
        label: 'Bus Revenue',
        data: displayData?.busData || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Canteen Revenue',
        data: displayData?.canteenData || [],
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Total Revenue',
        data: displayData?.dates.map((_, index) => 
          (displayData?.busData[index] || 0) + (displayData?.canteenData[index] || 0)
        ) || [],
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const debtChartConfig = {
    labels: (filteredData || processedCreditData)?.dates || [],
    datasets: [
      {
        label: 'Bus Debt',
        data: (filteredData || processedCreditData)?.busData || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Canteen Debt',
        data: (filteredData || processedCreditData)?.canteenData || [],
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Total Debt',
        data: (filteredData || processedCreditData)?.dates.map((_, index) => 
          ((filteredData || processedCreditData)?.busData[index] || 0) + 
          ((filteredData || processedCreditData)?.canteenData[index] || 0)
        ) || [],
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: GH₵ ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'GH₵ ' + value.toLocaleString();
          }
        }
      }
    }
  };

  // Search and pagination logic
  const pendingTransactions = useMemo(() => {
    const filtered = (filteredData || sampleData).recentTransactions.filter(
      transaction => transaction.status === "Pending"
    );

    if (!searchQuery) return filtered;

    const query = searchQuery.toLowerCase();
    return filtered.filter(transaction => 
      transaction.student.toLowerCase().includes(query) ||
      transaction.type.toLowerCase().includes(query) ||
      transaction.amount.toString().includes(query)
    );
  }, [filteredData, searchQuery]);

  const totalPages = Math.ceil(pendingTransactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTransactions = pendingTransactions.slice(startIndex, startIndex + pageSize);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Debt Pending logic
  const debtPendingTransactions = useMemo(() => {
    const filtered = (filteredData || sampleData).recentTransactions.filter(
      transaction => transaction.type === "Debt Payment" && transaction.status === "Pending"
    );

    if (!debtSearchQuery) return filtered;

    const query = debtSearchQuery.toLowerCase();
    return filtered.filter(transaction => 
      transaction.student.toLowerCase().includes(query) ||
      transaction.amount.toString().includes(query)
    );
  }, [filteredData, debtSearchQuery]);

  const debtTotalPages = Math.ceil(debtPendingTransactions.length / debtPageSize);
  const debtStartIndex = (debtCurrentPage - 1) * debtPageSize;
  const debtPaginatedTransactions = debtPendingTransactions.slice(debtStartIndex, debtStartIndex + debtPageSize);

  const handleDebtSearch = (e) => {
    setDebtSearchQuery(e.target.value);
    setDebtCurrentPage(1);
  };

  const handleDebtPageChange = (newPage) => {
    setDebtCurrentPage(newPage);
  };

  const handleDebtPageSizeChange = (newSize) => {
    setDebtPageSize(Number(newSize));
    setDebtCurrentPage(1);
  };

  return (
    <div className="mt-3 p-4 min-h-screen bg-gray-100 dark:bg-navy-900">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-navy-700 dark:text-white">Accountant Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Financial overview and transaction management</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  max={dateRange.endDate}
                  className="w-full sm:w-auto pl-10 pr-4 py-2 text-sm font-medium text-navy-700 dark:text-white bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-colors"
                />
                <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-navy-700 dark:text-white" />
              </div>
              <span className="text-navy-700 dark:text-white text-center sm:text-left">to</span>
              <div className="relative w-full sm:w-auto">
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  min={dateRange.startDate}
                  className="w-full sm:w-auto pl-10 pr-4 py-2 text-sm font-medium text-navy-700 dark:text-white bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-colors"
                />
                <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-navy-700 dark:text-white" />
              </div>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                onClick={applyFilter}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
              >
                <MdFilterList className="h-5 w-5 mr-2" />
                Apply Filter
              </button>
              <button
                onClick={clearFilter}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 text-sm font-medium text-navy-700 dark:text-white bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 hover:bg-gray-50 dark:hover:bg-navy-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
              >
                <MdClear className="h-5 w-5 mr-2" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<MdAttachMoney className="h-7 w-7" />}
          title="Total Revenue"
          subtitle={loading ? "Loading..." : `GH₵ ${displayData?.totalRevenue?.toFixed(2) || "0.00"}`}
        />
        <Widget
          icon={<MdPayments className="h-7 w-7" />}
          title="Total Debt"
          subtitle={loading ? "Loading..." : `GH₵ ${(filteredData || processedCreditData)?.totalDebt?.toFixed(2) || "0.00"}`}
        />
        <Widget
          icon={<MdPendingActions className="h-7 w-7" />}
          title="Pending Payments"
          subtitle={loading ? "Loading..." : `GH₵ ${processedEntriesData?.totalPendingPayments?.toFixed(2) || "0.00"}`}
        />
        <Widget
          icon={<MdTrendingDown className="h-7 w-7" />}
          title="Pending Debt"
          subtitle="GH₵ 1060.00"
        />
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="bg-white dark:bg-navy-800 shadow-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Revenue Trend
              </h4>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-navy-700 dark:text-white">Loading...</p>
              </div>
            ) : (
              <Line data={revenueChartConfig} options={chartOptions} />
            )}
          </div>
        </Card>

        <Card className="bg-white dark:bg-navy-800 shadow-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Debt Trend
              </h4>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-navy-700 dark:text-white">Loading...</p>
              </div>
            ) : (
              <Line data={debtChartConfig} options={chartOptions} />
            )}
          </div>
        </Card>
      </div>

      {/* Pending Payments */}
      <PendingPayments
        transactions={paginatedTransactions}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />

      {/* Debt Pending */}
      <DebtPending
        transactions={debtPaginatedTransactions}
        searchQuery={debtSearchQuery}
        onSearch={handleDebtSearch}
        currentPage={debtCurrentPage}
        pageSize={debtPageSize}
        onPageSizeChange={handleDebtPageSizeChange}
        onPageChange={handleDebtPageChange}
        totalPages={debtTotalPages}
      />
    </div>
  );
};

export default AccountDash; 