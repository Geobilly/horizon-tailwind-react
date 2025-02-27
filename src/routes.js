import React from "react";
import { Navigate } from "react-router-dom";
import { FaFutbol } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { MdVerifiedUser } from "react-icons/md";
import { MdPeople } from "react-icons/md";
import { FaCashRegister } from "react-icons/fa";
import {jwtDecode} from "jwt-decode";

// Import views
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import SignIn from "views/auth/SignIn";
import SignUp from "views/auth/SignUp";

import EntriesTable from "views/admin/tables/components/EntriesTable";
import StudentList from "views/admin/tables/components/StudentList";
import UsersTable from "views/admin/tables/components/UsersTable";
import CreditTable from "views/admin/tables/components/CreditTable";
import Permission from "views/admin/tables/components/Permission";
import TerminalTable from "views/admin/tables/components/TerminalTable";

// Import icons
import {
  MdHome,
  MdPerson,
  MdLock,
  MdListAlt,
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
  {
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
  {
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
  // {
  //   name: "Players",
  //   layout: "/admin",
  //   path: "players",
  //   icon: <FaFutbol  className="h-6 w-6" />, // Football icon
  //   component: (
  //     <ProtectedRoute>
  //       <PlayersTable />
  //     </ProtectedRoute>
  //   ),
  // },
  
  {
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
  {
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

  {
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
    hideInSidebar: true, // Hides this route from the sidebar
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
    hideInSidebar: true, // Hides this route from the sidebar

  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignUp />,
    hideInSidebar: true, // Hides this route from the sidebar

  },
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
].filter(Boolean); // Filter out any false values

export default routes;
