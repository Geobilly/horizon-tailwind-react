import React, { useState, useEffect } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import MiniCalendar from "components/calendar/MiniCalendar";
import { jwtDecode } from "jwt-decode";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const lineChartOptions = (isDarkMode) => ({
  legend: { show: true },
  theme: { mode: isDarkMode ? "dark" : "light" },
  chart: { type: "line", toolbar: { show: false } },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth" },
  xaxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    labels: {
      style: {
        colors: isDarkMode ? "#E0E0E0" : "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: isDarkMode ? "#E0E0E0" : "#A3AED0",
      },
    },
  },
  grid: {
    borderColor: isDarkMode ? "#444" : "#ccc",
  },
  tooltip: {
    theme: isDarkMode ? "dark" : "light",
  },
});

const TotalSpent = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [categories, setCategories] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getSchoolId = () => {
    const userToken = JSON.parse(localStorage.getItem("Edupay"))?.token;
    return userToken ? jwtDecode(userToken).school_id : null;
  };

  const fetchData = async () => {
    try {
      const schoolId = getSchoolId();
      if (!schoolId) return null;

      const response = await fetch(`https://edupaygh-backend.onrender.com/fetchreport/${schoolId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
      if (data) {
        // Filter out items where status is "Pending"
        const filteredReport = data.report.filter(item => item.status !== 'Pending');
  
        const uniqueCategories = [...new Set(filteredReport.map(item => item.terminal))];
        setCategories(uniqueCategories);
  
        // Calculate total amount based on filtered data
        setTotalAmount(
          filteredReport
            .filter(item => selectedDate ? item.date === selectedDate : true)
            .reduce((sum, curr) => sum + curr.totalAmount, 0)
        );
      }
    };
    loadData();
  }, [selectedDate]);
  
  useEffect(() => {
    if (categories.length === 0) return;
  
    const processChartData = async () => {
      const data = await fetchData();
      if (!data) return;
  
      // Filter out items where status is "Pending"
      const filteredReport = data.report.filter(item => item.status !== 'Pending');
  
      const categorySeries = {};
      categories.forEach(cat => categorySeries[cat] = new Array(7).fill(0));
  
      filteredReport.forEach(item => {
        if (item.date === selectedDate && categorySeries[item.terminal]) {
          categorySeries[item.terminal] = item.paid;
        }
      });
  
      setChartData(Object.keys(categorySeries).map(cat => ({
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        data: categorySeries[cat],
      })));
    };
  
    processChartData();
  }, [categories, selectedDate]);
  

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener('change', (e) => setIsDarkMode(e.matches));
    return () => mediaQuery.removeEventListener('change', (e) => setIsDarkMode(e.matches));
  }, []);

  return (
    <Card extra="!p-[20px] text-center bg-white dark:bg-gray-900 shadow-lg dark:shadow-xl">
      <div className="flex justify-between">
        <div className="relative">
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="p-2 rounded-lg flex items-center gap-2 
                      bg-lightPrimary dark:bg-gray-800 
                      text-gray-800 dark:text-gray-300 
                      border border-gray-300 dark:border-gray-700 
                      shadow-md dark:shadow-lg 
                      hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200"
          >
            <MdOutlineCalendarToday className="text-gray-600 dark:text-gray-300" />
            {selectedDate || "Select Date"}
          </button>

          {isCalendarOpen && (
            <div className="absolute z-10 mt-2 p-2 rounded-lg 
                        bg-white dark:bg-gray-900 
                        shadow-md border border-gray-200 dark:border-gray-700">
              <MiniCalendar
                onSelect={(date) => { setSelectedDate(date); setIsCalendarOpen(false); }}
              />
            </div>
          )}
        </div>
      </div>

      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        ₵{totalAmount.toFixed(2)}
      </p>
      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Total Amount</p>

      <LineChart options={lineChartOptions(isDarkMode)} series={chartData} />
    </Card>
  );
};

export default TotalSpent;
