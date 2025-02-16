import React, { useState, useEffect } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import Card from "components/card";
import Chart from "react-apexcharts";
import MiniCalendar from "components/calendar/MiniCalendar";
import {jwtDecode} from "jwt-decode"; // Ensure you have this installed

// Function to extract school_id from token stored in localStorage
const getSchoolId = () => {
  const userToken = JSON.parse(localStorage.getItem("Edupay"))?.token;
  if (userToken) {
    const decodedToken = jwtDecode(userToken);
    console.log("Decoded school_id:", decodedToken.school_id);
    return decodedToken.school_id;
  }
  return null;
};

// Function to format date (YYYY-MM-DD)
const formatDate = (dateStr) => {
  return new Date(dateStr).toISOString().split("T")[0];
};

const TotalOwing = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date())); // Default to today
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [totalOwing, setTotalOwing] = useState(0);

  // Fetch data from API
  const fetchCreditReport = async () => {
    const schoolId = getSchoolId();
    if (!schoolId) return;

    try {
      const response = await fetch(`https://edupaygh-backend.onrender.com/fetchcreditreport/${schoolId}`);
      const data = await response.json();
      console.log("Fetched API Data:", data);

      // Filter data for selected date
      const filteredData = data.filter(entry => formatDate(entry.date) === selectedDate);
      console.log("Filtered Data:", filteredData);

      // Process terminal amounts
      let terminalAmounts = {};
      let totalAmount = 0;

      filteredData.forEach(entry => {
        entry.terminal.forEach(term => {
          terminalAmounts[term.terminal] = (terminalAmounts[term.terminal] || 0) + term.amount;
          totalAmount += term.amount;
        });
      });

      console.log("Processed Terminal Data:", terminalAmounts);

      // Prepare data for chart
      setChartData(
        Object.keys(terminalAmounts).map(terminal => ({
          name: terminal,
          data: [terminalAmounts[terminal]]
        }))
      );

      setTotalOwing(totalAmount);
    } catch (error) {
      console.error("Error fetching credit report:", error);
    }
  };

  // Fetch data when selectedDate changes
  useEffect(() => {
    fetchCreditReport();
  }, [selectedDate]);

  // Detect dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener("change", (e) => setIsDarkMode(e.matches));
    return () => mediaQuery.removeEventListener("change", (e) => setIsDarkMode(e.matches));
  }, []);

  // Chart configuration
  const chartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chartData.map(entry => entry.name), // Terminals as X-axis
      labels: { style: { colors: isDarkMode ? "#E0E0E0" : "#A3AED0", fontSize: "14px" } }
    },
    yaxis: {
      labels: { style: { colors: isDarkMode ? "#E0E0E0" : "#A3AED0" } }
    },
    tooltip: { theme: isDarkMode ? "dark" : "light" },
    theme: { mode: isDarkMode ? "dark" : "light" }
  };

  return (
    <Card extra="!p-[20px] text-center bg-white dark:bg-gray-900 shadow-lg dark:shadow-xl min-h-[450px]">
      {/* Top Section */}
      <div className="flex justify-between">
        {/* Calendar Button */}
        <div className="relative">
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="p-2 rounded-lg flex items-center gap-2 bg-lightPrimary dark:bg-gray-800 
                      text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 
                      shadow-md dark:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200"
          >
            <MdOutlineCalendarToday className="text-gray-600 dark:text-gray-300" />
            {selectedDate || "Select Date"}
          </button>

          {isCalendarOpen && (
            <div className="absolute z-10 mt-2 p-2 rounded-lg bg-white dark:bg-gray-900 
                        shadow-md border border-gray-200 dark:border-gray-700">
              <MiniCalendar onSelect={(date) => { setSelectedDate(formatDate(date)); setIsCalendarOpen(false); }} />
            </div>
          )}
        </div>
      </div>

      {/* Total Owing Amount */}
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-4">
        ₵{totalOwing.toFixed(2)}
      </p>
      <p className="text-sm font-bold text-red-600 dark:text-red-400">Total Owing</p>

      {/* Debugging: Show Data Before Chart
      <pre className="text-xs text-left bg-gray-200 p-2 rounded-lg overflow-auto">
        {JSON.stringify(chartData, null, 2)}
      </pre> */}

      {/* Bar Chart with Fixed Height */}
      <div style={{ height: "300px", marginTop: "10px" }}>
        {chartData.length > 0 ? (
          <Chart options={chartOptions} series={chartData} type="bar" height="100%" />
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mt-4">No data available for the selected date.</p>
        )}
      </div>
    </Card>
  );
};

export default TotalOwing;
