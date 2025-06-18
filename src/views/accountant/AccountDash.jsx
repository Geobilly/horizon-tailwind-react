import React, { useState, useMemo, useEffect } from "react";
import Card from "components/card";
import Widget from "components/widget/Widget";
import { MdAttachMoney, MdPayments, MdPendingActions, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import PieChart from "./components/PieChart";
import axios from "axios";

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

  // Process API data for revenue calculations - only current day
  const processedRevenueData = useMemo(() => {
    if (!apiData) return null;

    const today = new Date().toISOString().split('T')[0];
    
    // Filter data for today only
    const todayData = apiData.filter(item => item.date === today);

    // Calculate totals for today
    const totalRevenue = todayData.reduce((sum, item) => sum + item.totalAmount, 0);

    // Group by terminal for today
    const busTotal = todayData
      .filter(item => item.terminal === 'bus')
      .reduce((sum, item) => sum + item.totalAmount, 0);
    
    const canteenTotal = todayData
      .filter(item => item.terminal === 'canteen')
      .reduce((sum, item) => sum + item.totalAmount, 0);

    return {
      totalRevenue,
      busTotal,
      canteenTotal
    };
  }, [apiData]);

  // Process credit data for debt calculations - only current day
  const processedCreditData = useMemo(() => {
    if (!creditData) return null;

    const today = new Date().toISOString().split('T')[0];
    
    // Filter data for today only
    const todayData = creditData.filter(item => 
      new Date(item.date).toISOString().split('T')[0] === today
    );

    // Calculate total debt for today
    const totalDebt = todayData.reduce((sum, item) => sum + item.total, 0);

    return {
      totalDebt
    };
  }, [creditData]);

  // Process entries data for pending payments - only current day
  const processedEntriesData = useMemo(() => {
    if (!entriesData) return null;

    const today = new Date().toISOString().split('T')[0];
    
    // Filter entries for today only
    const todayEntries = entriesData.filter(entry => 
      new Date(entry.created_at).toISOString().split('T')[0] === today
    );

    // Calculate total pending payments for today
    const totalPendingPayments = todayEntries
      .filter(entry => entry.status === "Pending")
      .reduce((sum, entry) => sum + entry.total_amount, 0);

    return {
      totalPendingPayments,
      entries: todayEntries
    };
  }, [entriesData]);

  // Use processed API data
  const displayData = processedRevenueData;

  return (
    <div className="mt-3 p-4 min-h-screen bg-gray-100 dark:bg-navy-900">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-navy-700 dark:text-white">Accountant Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Today's Financial Overview</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<MdAttachMoney className="h-7 w-7" />}
          title="Today's Revenue"
          subtitle={loading ? "Loading..." : `GH₵ ${displayData?.totalRevenue?.toFixed(2) || "0.00"}`}
        />
        <Widget
          icon={<MdPayments className="h-7 w-7" />}
          title="Today's Debt"
          subtitle={loading ? "Loading..." : `GH₵ ${processedCreditData?.totalDebt?.toFixed(2) || "0.00"}`}
        />
        <Widget
          icon={<MdPendingActions className="h-7 w-7" />}
          title="Today's Pending Revenue"
          subtitle={loading ? "Loading..." : `GH₵ ${processedEntriesData?.totalPendingPayments?.toFixed(2) || "0.00"}`}
        />
        <Widget
          icon={<MdTrendingDown className="h-7 w-7" />}
          title="Today's Pending Debt"
          subtitle={loading ? "Loading..." : `GH₵ ${processedCreditData?.totalDebt?.toFixed(2) || "0.00"}`}
        />
      </div>

      {/* Revenue Distribution Chart */}
      <div className="mb-8">
        <PieChart data={apiData} loading={loading} />
      </div>
    </div>
  );
};

export default AccountDash; 