import React, { useState } from "react";
import Card from "components/card";
import { FaTimes, FaUser, FaPhone, FaMapMarkerAlt, FaGraduationCap } from "react-icons/fa";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import CircularWithValueLabel from "components/loader/index";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaystackPayment from "components/payment/PaystackPayment";

// API base URL
const API_BASE_URL = "https://edupaygh-backend.onrender.com";

const AddCustomerPage = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [agent, setAgent] = useState({
    agentId: agentId,
    agentName: "Loading...",
    agentLocation: "Loading..."
  });
  const [agentLoading, setAgentLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    level: "",
    contact: "",
    location: "",
    school: "Kempshot Grammar Academy"
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingCustomerData, setPendingCustomerData] = useState(null);

  // Fetch agent data on component mount
  React.useEffect(() => {
    const fetchAgentData = async () => {
      // Check if agent data was passed via navigation state (from button click)
      if (location.state) {
        setAgent({
          agentId: location.state.agentId,
          agentName: location.state.agentName,
          agentLocation: location.state.agentLocation
        });
        setAgentLoading(false);
        return;
      }

      // Otherwise fetch from API (for QR code scans)
      try {
        const response = await axios.get(`${API_BASE_URL}/fetchagents`);
        
        if (response.data && response.data.agents) {
          const agentData = response.data.agents.find(a => a.id === parseInt(agentId));
          
          if (agentData) {
            setAgent({
              agentId: agentData.id,
              agentName: agentData.name,
              agentLocation: agentData.location
            });
          } else {
            setAgent({
              agentId: agentId,
              agentName: "Unknown Agent",
              agentLocation: "Unknown"
            });
            toast.warning("Agent not found");
          }
        }
      } catch (error) {
        console.error("Error fetching agent data:", error);
        toast.error("Failed to load agent information");
        setAgent({
          agentId: agentId,
          agentName: "Unknown Agent",
          agentLocation: "Unknown"
        });
      } finally {
        setAgentLoading(false);
      }
    };

    fetchAgentData();
  }, [agentId, location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form and prepare customer data
    const customerData = {
      name: formData.name,
      email: formData.email,
      agent_id: parseInt(agent.agentId || agentId),
      level: formData.level,
      contact: formData.contact,
      location: formData.location,
      payment: 0.01 // Will be updated with actual Paystack payment amount
    };

    // Store customer data and show payment modal
    console.log("Initial customer data:", customerData);
    setPendingCustomerData(customerData);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (reference) => {
    setShowPayment(false);
    setLoading(true);

    // Add payment reference and actual payment amount to customer data
    const customerDataWithPayment = {
      ...pendingCustomerData,
      payment: 0.01, // Actual amount processed by Paystack (1 pesewa)
      payment_reference: reference.reference,
      payment_status: "paid"
    };

    // Debug: Log what we're sending to the API
    console.log("Sending customer data to API:", customerDataWithPayment);

    try {
      const response = await axios.post(`${API_BASE_URL}/addcustomer`, customerDataWithPayment);
      
      if (response.data && response.data.customer) {
        toast.success("Payment successful! Customer added successfully!");
        setIsModalOpen(true);
        // Reset form
        setFormData({
          name: "",
          email: "",
          level: "",
          contact: "",
          location: "",
          school: "Kempshot Grammar Academy"
        });
        setPendingCustomerData(null);
        
        // Refresh the page to show updated customer data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else if (error.message === "Network Error") {
        toast.error("Network Error: Unable to connect to the server. Please check if the server is running.");
      } else {
        toast.error("There was an error adding the customer. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    toast.info("Payment cancelled. Please complete payment to add customer.");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/admin/agents');
  };

  const handleBack = () => {
    navigate('/admin/agents');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

      {/* Loader */}
      {(loading || agentLoading) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000] backdrop-blur-md">
          <CircularWithValueLabel size={80} color="#36d7b7" />
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Agent ID:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{agent.agentId || agentId}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Agent Name:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{agent.agentName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* School Selection Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Add New Customer
          </h1>
          
          {/* School Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card extra="p-6 cursor-pointer transition-all duration-200 hover:shadow-lg">
              <div 
                className={`text-center p-4 rounded-lg border-2 transition-colors ${
                  formData.school === "Kempshot Grammar Academy" 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setFormData(prev => ({ ...prev, school: "Kempshot Grammar Academy" }))}
              >
                <FaGraduationCap className="w-12 h-12 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Kempshot Grammar Academy
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Secondary Education
                </p>
              </div>
            </Card>

            <Card extra="p-6 cursor-pointer transition-all duration-200 hover:shadow-lg">
              <div 
                className={`text-center p-4 rounded-lg border-2 transition-colors ${
                  formData.school === "Kempshot Business College" 
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setFormData(prev => ({ ...prev, school: "Kempshot Business College" }))}
              >
                <FaGraduationCap className="w-12 h-12 mx-auto mb-3 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Kempshot Business College
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tertiary Education
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Customer Form */}
        <Card extra="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter customer's full name"
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaGraduationCap className="inline w-4 h-4 mr-2" />
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select level</option>
                  {formData.school === "Kempshot Grammar Academy" ? (
                    <>
                      <option value="Nursery">Nursery</option>
                      <option value="Nursery 2">Nursery 2</option>
                      <option value="KG 1">KG 1</option>
                      <option value="KG 2">KG 2</option>
                      <option value="Class 1">Class 1</option>
                      <option value="Class 2">Class 2</option>
                      <option value="Class 3">Class 3</option>
                      <option value="Class 4">Class 4</option>
                      <option value="Class 5">Class 5</option>
                      <option value="Class 6">Class 6</option>
                      <option value="JHS 1">JHS 1</option>
                      <option value="JHS 2">JHS 2</option>
                      <option value="JHS 3">JHS 3</option>
                    </>
                  ) : (
                    <>
                      <option value="SHS 1">SHS 1</option>
                      <option value="SHS 2">SHS 2</option>
                      <option value="SHS 3">SHS 3</option>
                    </>
                  )}
                </select>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="customer@example.com"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaPhone className="inline w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaMapMarkerAlt className="inline w-4 h-4 mr-2" />
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select location</option>
                  <option value="Accra">Accra</option>
                  <option value="Kumasi">Kumasi</option>
                  <option value="Tamale">Tamale</option>
                  <option value="Cape Coast">Cape Coast</option>
                  <option value="Takoradi">Takoradi</option>
                </select>
              </div>

            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Proceed to Payment (GHS 0.01)"}
              </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Test Mode: Registration fee of GHS 0.01 (1 pesewa)
                </p>
            </div>
          </form>
        </Card>
      </div>

      {/* Payment Modal */}
      {showPayment && pendingCustomerData && (
        <PaystackPayment
          email={formData.email}
          name={formData.name}
          phone={formData.contact}
          amount={1} // GHS 0.01 (1 pesewa) - FOR TESTING
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}

      {/* Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Customer Added Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The customer has been added to {agent.agentName}'s list.
              </p>
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCustomerPage;
