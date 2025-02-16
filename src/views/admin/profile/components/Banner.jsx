import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
// import avatar from "assets/img/avatars/avatar11.png";  // Comment out image import
import banner from "assets/img/profile/banner.png";
import Card from "components/card";

const Banner = () => {
  const location = useLocation();
  const studentId = location.state?.studentId;
  const [studentData, setStudentData] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);

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
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [studentId]);

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
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            GH₵ {totalBalance || "0"}
          </p>
          <p className="text-sm font-normal text-gray-600">Balance</p>
        </div>
      </div>
    </Card>
  );
};

export default Banner;
