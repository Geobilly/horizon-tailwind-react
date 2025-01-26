import React, { useState } from "react";
import {
  MdArrowDropUp,
  MdOutlineCalendarToday,
  MdBarChart,
} from "react-icons/md";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import MiniCalendar from "components/calendar/MiniCalendar";
import { BsThreeDots } from "react-icons/bs";
import TotalAmountCardMenu from "..//..//..//..//components/card/TotalAmountCardMenu";

// Line chart data and options
const lineChartDataTotalSpent = [
  {
    name: "Paid",
    data: [0, 64, 48, 66, 49, 68, 56],
    color: "#4318FF",
  },
  {
    name: "Not Paid",
    data: [0, 40, 24, 46, 20, 46, 67],
    color: "#FF0000",
  },
];

const lineChartOptionsTotalSpent = {
  legend: {
    show: false,
  },
  theme: {
    mode: "light",
  },
  chart: {
    type: "line",
    // width: "100%",  // Make sure the chart takes up the full width available

    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000",
    },
    theme: "dark",
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
  grid: {
    show: false,
  },
  xaxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    show: true,
    labels: {
      show: true,
      // rotate: -45,  // Rotate labels if necessary

      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  
  yaxis: {
    show: false,
  },
};

const TotalSpent = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const applyFilter = () => {
    // Add the logic to apply the filter here
    console.log("Filter applied");
    setIsCalendarOpen(false); // Close the calendar after applying
  };
  // "#FF0000", "#4318FF"

  return (
    <Card extra="!p-[20px] text-center">
      <div className="flex justify-between">
        <button
          onClick={toggleCalendar}
          className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80"
        >
          <MdOutlineCalendarToday />
          <span className="text-sm font-medium text-gray-600">Today</span>
        </button>
        {/* <header className="relative flex items-center justify-between">
          <TotalAmountCardMenu />
        </header> */}
      </div>

      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="flex flex-col">
          <p className="mt-[20px] text-3xl font-bold text-navy-700 dark:text-white">
            ₵3,700.00
          </p>
          <div className="flex flex-col items-start">
            <p className="mt-2 text-sm text-gray-600">Total Amount</p>
            <div className="flex flex-row items-center justify-center">
              <MdArrowDropUp className="font-medium text-green-500" />
              <p className="text-sm font-bold text-green-500"> +2.45% </p>
            </div>
            <select className="mt-2 p-2 rounded-lg border text-sm bg-white dark:bg-navy-700 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="bus">Bus</option>
              <option value="canteen">Canteen</option>
            </select>
          </div>
        </div>
        <div className="h-full w-full">
          <LineChart
            options={lineChartOptionsTotalSpent}
            series={lineChartDataTotalSpent}
          />
        </div>
      </div>

      {/* Render the MiniCalendar conditionally */}
      {isCalendarOpen && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="relative z-10">
            <MiniCalendar />
            <div className="mt-4 flex gap-2">
              <button
                onClick={applyFilter}
                className="p-2 bg-blue-500 text-white rounded-lg text-sm"
              >
                Apply
              </button>
              <button
                onClick={toggleCalendar}
                className="p-1 bg-red-500 text-white rounded-lg text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TotalSpent;
