import React, { useState, useEffect } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import Card from "components/card";
import MiniCalendar from "components/calendar/MiniCalendar";
import { jwtDecode } from "jwt-decode";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const getSchoolId = () => {
  const userToken = JSON.parse(localStorage.getItem("Edupay"))?.token;
  return userToken ? jwtDecode(userToken).school_id : null;
};

const TotalRevenue = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartData, setChartData] = useState([]);

  const fetchRevenueData = async () => {
    try {
      const schoolId = getSchoolId();
      if (!schoolId) return [];
      const response = await fetch(`https://edupaygh-backend.onrender.com/fetchrevenue/${schoolId}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadRevenueData = async () => {
      const data = await fetchRevenueData();
      if (data.length) {
        const dailyData = data.filter(item => item.date.startsWith(selectedDate));
        setTotalRevenue(dailyData.reduce((sum, item) => sum + item.revenue, 0));
        
        const formattedData = dailyData.map(item => ({
          date: item.date.split(" ")[0],
          revenue: item.revenue,
        }));

        setChartData(formattedData);
      }
    };
    loadRevenueData();
  }, [selectedDate]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener('change', e => setIsDarkMode(e.matches));
    return () => mediaQuery.removeEventListener('change', e => setIsDarkMode(e.matches));
  }, []);

  return (
    <Card extra="!p-[20px] text-center bg-white dark:bg-gray-900 shadow-lg dark:shadow-xl">
      <div className="flex justify-between">
        <div className="relative">
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="p-2 rounded-lg flex items-center gap-2 bg-lightPrimary dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 shadow-md dark:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200"
          >
            <MdOutlineCalendarToday className="text-gray-600 dark:text-gray-300" />
            {selectedDate || "Select Date"}
          </button>
          {isCalendarOpen && (
            <div className="absolute z-10 mt-2 p-2 rounded-lg bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700">
              <MiniCalendar onSelect={date => { setSelectedDate(date); setIsCalendarOpen(false); }} />
            </div>
          )}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">₵{totalRevenue.toFixed(2)}</p>
      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Total Revenue</p>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="date" stroke={isDarkMode ? "#E0E0E0" : "#A3AED0"} />
            <YAxis stroke={isDarkMode ? "#E0E0E0" : "#A3AED0"} />
            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff" }} />
            <Bar dataKey="revenue" fill={isDarkMode ? "#4f46e5" : "#2563eb"} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TotalRevenue;
