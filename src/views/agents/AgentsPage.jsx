import React, { useState, useMemo } from "react";
import Card from "components/card";
import Widget from "components/widget/Widget";
import { FaUsers, FaUser, FaDollarSign, FaTimes } from "react-icons/fa";
import { MdSearch, MdDownload, MdCalendarToday } from "react-icons/md";
import { useTable, useGlobalFilter, usePagination, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";

// Sample data for agents
const agentsData = [
  {
    id: 1,
    name: "Kwame Asante",
    location: "Accra",
    contact: "+233 24 123 4567",
    customers: 45,
    dateCreated: "2024-01-15"
  },
  {
    id: 2,
    name: "Ama Osei", 
    location: "Kumasi",
    contact: "+233 20 234 5678",
    customers: 38,
    dateCreated: "2024-02-03"
  },
  {
    id: 3,
    name: "Kofi Mensah",
    location: "Tamale", 
    contact: "+233 26 345 6789",
    customers: 52,
    dateCreated: "2024-01-28"
  },
  {
    id: 4,
    name: "Akosua Boateng",
    location: "Cape Coast",
    contact: "+233 24 456 7890",
    customers: 29,
    dateCreated: "2024-03-10"
  },
  {
    id: 5,
    name: "Yaw Appiah",
    location: "Takoradi",
    contact: "+233 20 567 8901",
    customers: 41,
    dateCreated: "2024-02-18"
  }
];

// Sample data for customers
const customersData = [
  {
    id: 1,
    name: "Adwoa Serwaa",
    level: "SHS 3",
    contact: "+233 24 678 9012",
    location: "Accra",
    payment: "₵1,200",
    dateCreated: "2024-01-20"
  },
  {
    id: 2,
    name: "Kojo Nkrumah",
    level: "SHS 2", 
    contact: "+233 20 789 0123",
    location: "Kumasi",
    payment: "₵800",
    dateCreated: "2024-02-05"
  },
  {
    id: 3,
    name: "Efua Adjei",
    level: "SHS 1",
    contact: "+233 26 890 1234", 
    location: "Tamale",
    payment: "₵500",
    dateCreated: "2024-03-01"
  },
  {
    id: 4,
    name: "Kwabena Owusu",
    level: "SHS 3",
    contact: "+233 24 901 2345",
    location: "Cape Coast", 
    payment: "₵1,100",
    dateCreated: "2024-01-30"
  },
  {
    id: 5,
    name: "Abena Konadu",
    level: "SHS 2",
    contact: "+233 20 012 3456",
    location: "Takoradi",
    payment: "₵750",
    dateCreated: "2024-02-22"
  }
];

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
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
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
      ),
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAgent = {
      id: Date.now(), // Simple ID generation
      ...formData,
      customers: 0, // Default to 0 for new agents
      dateCreated: new Date().toISOString().split('T')[0]
    };
    onAddAgent(newAgent);
    setFormData({ name: "", location: "", contact: "" });
    onClose();
  };

  const handleClose = () => {
    setFormData({ name: "", location: "", contact: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
  const [agents, setAgents] = useState(agentsData);

  const handleAddAgent = (newAgent) => {
    setAgents(prevAgents => [...prevAgents, newAgent]);
  };

  return (
    <div className="p-6">
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
          subtitle="5,450"
        />
        <Widget
          icon={<FaDollarSign className="h-7 w-7" />}
          title="Total Income"
          subtitle="₵250,000"
        />
      </div>

      {/* Tables */}
      <div className="space-y-6">
        <DataTable
          columns={AgentsColumns()}
          data={agents}
          title="Agents Summary"
          searchPlaceholder="Search agents"
          showAddButton={true}
          onAddAgent={handleAddAgent}
        />
        <DataTable
          columns={customersColumns}
          data={customersData}
          title="Customers Summary"
          searchPlaceholder="Search customers"
        />
      </div>
    </div>
  );
};

export default AgentsPage;
