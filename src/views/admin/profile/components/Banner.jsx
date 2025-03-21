import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
// import avatar from "assets/img/avatars/avatar11.png";  // Comment out image import
import banner from "assets/img/profile/banner.png";
import Card from "components/card";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const Banner = () => {
  const location = useLocation();
  const studentId = location.state?.studentId;
  const [studentData, setStudentData] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [terminalBalances, setTerminalBalances] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) return;
      
      try {
        const response = await fetch(`https://edupaygh-backend.onrender.com/fetchstudent/${studentId}`);
        const data = await response.json();
        if (data.student) {
          setStudentData(data.student);
          setTotalBalance(data.total_balance);
          setTotalDebt(data.total_debt);
          setTerminalBalances(data.terminal_balances || {});
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const chartData = {
    labels: terminalBalances ? Object.keys(terminalBalances) : [],
    datasets: [
      {
        data: terminalBalances ? Object.values(terminalBalances) : [],
        backgroundColor: [
          '#4318FF',  // Deep Blue
          '#6AD2FF',  // Light Blue
          '#05CD99',  // Green
          '#FFB547',  // Orange
          '#EE5D50',  // Red
          '#E9EDF7',  // Gray
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: 'rgb(100, 116, 139)', // text-gray-500
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: GH₵ ${value.toFixed(2)}`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
      {/* Background and profile */}
      <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
          {/* Removed img tag, keeping the circular container */}
        </div>
      </div>

      {/* Name and position */}
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {studentData?.student_name || "Loading..."}
        </h4>
        <p className="text-base font-normal text-gray-600">
          {studentData?.class || "Loading..."}
        </p>
      </div>

      {/* Post followers */}
      <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">GH₵ {totalDebt || "0"}</p>
          <p className="text-sm font-normal text-gray-600">Debt</p>
        </div>
        {/* Commented out Debit section
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            58
          </p>
          <p className="text-sm font-normal text-gray-600">Debit</p>
        </div>
        */}
        <div className="flex flex-col items-center justify-center">
          <p 
            className="text-2xl font-bold text-navy-700 dark:text-white cursor-pointer hover:text-navy-500"
            onClick={() => setShowModal(true)}
          >
            GH₵ {totalBalance || "0"}
          </p>
          <p className="text-sm font-normal text-gray-600">Balance</p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-navy-800 rounded-xl p-6 w-[90%] max-w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-navy-700 dark:text-white">
                Balance Distribution
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="h-[300px]">
              {Object.keys(terminalBalances || {}).length > 0 ? (
                <Pie data={chartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No balance data available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Banner;
