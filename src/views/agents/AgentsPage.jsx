import React, { useState, useMemo, useEffect } from "react";
import Card from "components/card";
import Widget from "components/widget/Widget";
import { FaUsers, FaUser, FaDollarSign, FaTimes } from "react-icons/fa";
import { MdSearch, MdDownload, MdCalendarToday } from "react-icons/md";
import { useTable, useGlobalFilter, usePagination, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";
import QRCodeGenerator from "components/QRCodeGenerator";
import axios from "axios";
import CircularWithValueLabel from "components/loader/index";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// API base URL
const API_BASE_URL = "https://edupaygh-backend.onrender.com";

// Table columns for agents
const AgentsColumns = () => {
  const navigate = useNavigate();
  
  return [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "NAME", 
      accessor: "name",
    },
    {
      Header: "LOCATION",
      accessor: "location",
    },
    {
      Header: "CONTACT",
      accessor: "contact",
    },
    {
      Header: "CUSTOMERS",
      accessor: "customers",
      Cell: ({ value }) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {value}
        </span>
      ),
    },
    {
      Header: "DATE CREATED",
      accessor: "dateCreated",
      Cell: ({ value }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleDateString('en-GB')}
        </span>
      ),
    },
    {
      Header: "ACTIONS",
      accessor: "actions",
      Cell: ({ row }) => {
        const { generateAndDownloadQR } = QRCodeGenerator({
          agentId: row.original.id,
          agentName: row.original.name,
          agentLocation: row.original.location
        });

        return (
          <div className="flex gap-2">
            <button 
              onClick={generateAndDownloadQR}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <span>📱</span>
              Print QR Code
            </button>
            <button 
              onClick={() => navigate(`/empty/agents/${row.original.id}/add-customer`, {
                state: {
                  agentId: row.original.id,
                  agentName: row.original.name,
                  agentLocation: row.original.location
                }
              })}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <span>+</span>
              Add Customer
            </button>
          </div>
        );
      },
    },
  ];
};

// Table columns for customers
const customersColumns = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "AGENT ID",
    accessor: "agentId",
    Cell: ({ value }) => (
      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
        {value}
      </span>
    ),
  },
  {
    Header: "AGENT NAME",
    accessor: "agentName",
    Cell: ({ value }) => (
      <span className="font-medium text-gray-900 dark:text-white">
        {value}
      </span>
    ),
  },
  {
    Header: "LEVEL",
    accessor: "level",
    Cell: ({ value }) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        value === "SHS 3" ? "bg-green-100 text-green-800" :
        value === "SHS 2" ? "bg-blue-100 text-blue-800" :
        value === "SHS 1" ? "bg-yellow-100 text-yellow-800" :
        "bg-gray-100 text-gray-800"
      }`}>
        {value}
      </span>
    ),
  },
  {
    Header: "CONTACT",
    accessor: "contact",
  },
  {
    Header: "LOCATION", 
    accessor: "location",
  },
  {
    Header: "PAYMENT",
    accessor: "payment",
  },
  {
    Header: "DATE CREATED",
    accessor: "dateCreated",
    Cell: ({ value }) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {new Date(value).toLocaleDateString('en-GB')}
      </span>
    ),
  },
];

// Add Agent Modal Component
const AddAgentModal = ({ isOpen, onClose, onAddAgent }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contact: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const agentData = {
      name: formData.name,
      location: formData.location,
      contact: formData.contact
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/addagent`, agentData);
      
      if (response.data && response.data.agent) {
        const newAgent = {
          id: response.data.agent.id,
          name: response.data.agent.name,
          location: response.data.agent.location,
          contact: response.data.agent.contact,
          customers: 0,
          dateCreated: new Date().toISOString().split('T')[0]
        };
        
        onAddAgent(newAgent);
        toast.success(response.data.message || "Agent added successfully!");
        setFormData({ name: "", location: "", contact: "" });
        onClose();
      }
    } catch (error) {
      console.error("Error adding agent:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else if (error.message === "Network Error") {
        toast.error("Network Error: Unable to connect to the server. Please check if the server is running.");
      } else {
        toast.error("There was an error adding the agent. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", location: "", contact: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000] backdrop-blur-md">
          <CircularWithValueLabel size={80} color="#36d7b7" />
        </div>
      )}

      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add New Agent
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter agent's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select location</option>
              <option value="Accra">Accra</option>
              <option value="Kumasi">Kumasi</option>
              <option value="Tamale">Tamale</option>
              <option value="Cape Coast">Cape Coast</option>
              <option value="Takoradi">Takoradi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="+233 XX XXX XXXX"
            />
          </div>


          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Custom table component
const DataTable = ({ columns, data, title, searchPlaceholder, showAddButton = false, onAddAgent }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 3 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter: setTableGlobalFilter,
    state: { pageIndex, pageSize },
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
  } = tableInstance;

  // Update global filter when search changes
  React.useEffect(() => {
    setTableGlobalFilter(globalFilter);
  }, [globalFilter, setTableGlobalFilter]);

  return (
    <Card extra="w-full h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          {title}
        </h3>
        {showAddButton && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <span className="text-lg">+</span>
            {title.includes("Agent") ? "Add Agent" : "Add Customer"}
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Select date range"
          />
        </div>
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder={searchPlaceholder}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <MdDownload className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={index}
                    className="border-b border-gray-200 pr-4 pb-3 text-left dark:border-navy-700"
                  >
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {column.render("Header")}
                    </p>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  {row.cells.map((cell, index) => (
                    <td
                      className="pt-4 pb-4 text-sm"
                      {...cell.getCellProps()}
                      key={index}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, data.length)} of {data.length} results
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
          >
            ←
          </button>
          {pageOptions.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => tableInstance.gotoPage(pageNum)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                pageIndex === pageNum
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              }`}
            >
              {pageNum + 1}
            </button>
          ))}
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
          >
            →
          </button>
        </div>
      </div>

      {/* Add Agent Modal */}
      {title.includes("Agent") && (
        <AddAgentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddAgent={onAddAgent}
        />
      )}
    </Card>
  );
};

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch agents and customers on component mount
  useEffect(() => {
    fetchAgents();
    fetchCustomers();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/fetchagents`);
      
      if (response.data && response.data.agents) {
        // Transform API data to match our table format
        const transformedAgents = response.data.agents.map(agent => ({
          id: agent.id,
          name: agent.name,
          location: agent.location,
          contact: agent.contact,
          customers: agent.customers || 0, // Use actual customer count from API
          dateCreated: new Date(agent.date_created).toISOString().split('T')[0]
        }));
        
        setAgents(transformedAgents);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      if (error.message === "Network Error") {
        toast.error("Unable to connect to the server. Please check if the server is running.");
      } else {
        toast.error("Failed to fetch agents. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fetchcustomers`);
      
      if (response.data && response.data.customers) {
        // Transform API data to match our table format
        const transformedCustomers = response.data.customers.map(customer => ({
          id: customer.id,
          name: customer.name,
          agentId: customer.agent_id,
          agentName: customer.agent_name,
          level: customer.level,
          contact: customer.contact,
          location: customer.location,
          payment: `₵${customer.payment.toFixed(2)}`,
          dateCreated: new Date(customer.date_created).toISOString().split('T')[0]
        }));
        
        setCustomers(transformedCustomers);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      if (error.message === "Network Error") {
        toast.error("Unable to connect to the server. Please check if the server is running.");
      } else {
        toast.error("Failed to fetch customers. Please try again.");
      }
    }
  };

  const handleAddAgent = (newAgent) => {
    setAgents(prevAgents => [...prevAgents, newAgent]);
  };

  return (
    <div className="p-6">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000] backdrop-blur-md">
          <CircularWithValueLabel size={80} color="#36d7b7" />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Widget
          icon={<FaUsers className="h-7 w-7" />}
          title="Total Agents"
          subtitle={agents.length.toString()}
        />
        <Widget
          icon={<FaUser className="h-7 w-7" />}
          title="Total Customers"
          subtitle={customers.length.toString()}
        />
        <Widget
          icon={<FaDollarSign className="h-7 w-7" />}
          title="Total Income"
          subtitle={`₵${customers.reduce((sum, customer) => {
            const payment = parseFloat(customer.payment.replace('₵', '').replace(',', '')) || 0;
            return sum + payment;
          }, 0).toFixed(2)}`}
        />
      </div>

      {/* Tables */}
      <div className="space-y-6">
        <DataTable
          columns={AgentsColumns()}
          data={agents}
          title="Agent Summarys"
          searchPlaceholder="Search agents"
          showAddButton={true}
          onAddAgent={handleAddAgent}
        />
        <DataTable
          columns={customersColumns}
          data={customers}
          title="Customers Summary"
          searchPlaceholder="Search customers"
        />
      </div>
    </div>
  );
};

export default AgentsPage;
