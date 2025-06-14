import React from "react";
import { Navigate } from "react-router-dom";
import { FaFutbol } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { MdVerifiedUser } from "react-icons/md";
import { MdPeople } from "react-icons/md";
import { FaCashRegister } from "react-icons/fa";
import {jwtDecode} from "jwt-decode";
import { MdQrCodeScanner } from "react-icons/md";
import { MdDashboard } from "react-icons/md";

// Import views
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import SignIn from "views/auth/SignIn";
import SignUp from "views/auth/SignUp";
import TeacherSignin from "views/auth/TeacherSignin";
import TeacherDashboard from "views/teacher/TeacherDashboard";
import RecordPayment from "views/teacher/RecordPayment";
import PayDebt from "views/teacher/PayDebt";
import AccountDash from "views/accountant/AccountDash";

import EntriesTable from "views/admin/tables/components/EntriesTable";
import StudentList from "views/admin/tables/components/StudentList";
import UsersTable from "views/admin/tables/components/UsersTable";
import CreditTable from "views/admin/tables/components/CreditTable";
import Permission from "views/admin/tables/components/Permission";
import TerminalTable from "views/admin/tables/components/TerminalTable";
import Scanner from "views/admin/tables/components/Scanner";
import TakePicture from "views/admin/tables/components/TakePicture";

// Import icons
import {
  MdHome,
  MdPerson,
  MdLock,
  MdListAlt,
  MdSchool,
} from "react-icons/md";
import { FaUserGraduate } from "react-icons/fa";

// Import ProtectedRoute
import ProtectedRoute from "./ProtectedRoute";

// Function to get the role from the token
const getRoleFromToken = () => {
  const tokenData = localStorage.getItem("Edupay");
  if (tokenData) {
    try {
      const { token } = JSON.parse(tokenData); // Parse the stored object to extract the token
      const decodedToken = jwtDecode(token); // Use the correct function from jwt-decode
      return decodedToken.role; // Assuming "role" is a field in your token payload
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  return null;
};

const role = getRoleFromToken();

const routes = [
  // Admin-only routes
  role === "admin" && {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <MainDashboard />
      </ProtectedRoute>
    ),
  },
  role === "admin" && {
    name: "Student",
    layout: "/admin",
    path: "student",
    icon: <FaUserGraduate className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <StudentList />
      </ProtectedRoute>
    ),
  },
  role === "admin" && {
    name: "Daily Collections",
    layout: "/admin",
    path: "entry",
    icon: <MdListAlt className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <EntriesTable />
      </ProtectedRoute>
    ),
  },
  role === "admin" && {
    name: "Owing Student",
    layout: "/admin",
    path: "credit",
    icon: <MdAttachMoney className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <CreditTable />
      </ProtectedRoute>
    ),
  },
  role === "admin" && {
    name: "Permission",
    layout: "/admin",
    path: "permission",
    icon: <MdVerifiedUser className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <Permission />
      </ProtectedRoute>
    ),
  },
  // Common routes (visible to both admin and teacher)
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    hideInSidebar: true,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
    hideInSidebar: true,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignUp />,
    hideInSidebar: true,
  },
  {
    name: "Teacher Sign In",
    layout: "/auth",
    path: "teacher-sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <TeacherSignin />,
    hideInSidebar: true,
  },
  // Teacher Dashboard route - visible to both admin and teacher
  (role === "teacher" || role === "admin") && {
    name: "Teacher Dashboard",
    layout: "/admin",
    path: "teacher-dashboard",
    icon: <MdSchool className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <TeacherDashboard />
      </ProtectedRoute>
    ),
  },
  // Record Payment route - visible to both admin and teacher
  (role === "teacher" || role === "admin") && {
    name: "Record Payment",
    layout: "/admin",
    path: "record-payment",
    icon: <MdAttachMoney className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <RecordPayment />
      </ProtectedRoute>
    ),
  },
  // Pay Debt route - visible to both admin and teacher
  (role === "teacher" || role === "admin") && {
    name: "Pay Debt",
    layout: "/admin",
    path: "pay-debt",
    icon: <MdAttachMoney className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <PayDebt />
      </ProtectedRoute>
    ),
  },
  // Admin-only routes
  role === "admin" && {
    name: "Users",
    layout: "/admin",
    path: "users",
    icon: <MdPeople className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <UsersTable />
      </ProtectedRoute>
    ),
  },
  role === "admin" && {
    name: "Terminal",
    layout: "/admin",
    path: "terminal",
    icon: <FaCashRegister className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <TerminalTable />
      </ProtectedRoute>
    ),
  },
  role === "admin" && {
    name: "Scanner",
    layout: "/admin",
    path: "scanner",
    icon: <MdQrCodeScanner className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <Scanner />
      </ProtectedRoute>
    ),
  },
  role === "admin" && {
    name: "Take Picture",
    layout: "/admin",
    path: "take-picture",
    icon: <MdPerson className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <TakePicture />
      </ProtectedRoute>
    ),
  },
  // Accountant Dashboard route - visible to both admin and accountant
  (role === "accountant" || role === "admin") && {
    name: "Account Dashboard",
    layout: "/admin",
    path: "accountant-dashboard",
    icon: <MdDashboard className="h-6 w-6" />,
    component: (
      <ProtectedRoute>
        <AccountDash />
      </ProtectedRoute>
    ),
  },
].filter(Boolean); // Filter out any false values

export default routes;
