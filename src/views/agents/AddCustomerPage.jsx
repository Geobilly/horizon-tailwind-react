import React, { useState } from "react";
import Card from "components/card";
import { FaTimes, FaUser, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaQuestionCircle } from "react-icons/fa";
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
      payment: 20.00 // Will be updated with actual Paystack payment amount
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
      payment: 20.00, // Actual amount processed by Paystack
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="!top-4 sm:!top-2"
      />

      {/* Loader */}
      {(loading || agentLoading) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000] backdrop-blur-md">
          <CircularWithValueLabel size={80} color="#36d7b7" />
        </div>
      )}

      {/* Header - Mobile Optimized */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-2 gap-2 sm:gap-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
              <div className="text-xs sm:text-sm">
                <span className="text-gray-500 dark:text-gray-400">Agent ID:</span>
                <span className="ml-1.5 sm:ml-2 font-medium text-gray-900 dark:text-white">{agent.agentId || agentId}</span>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="text-gray-500 dark:text-gray-400">Agent:</span>
                <span className="ml-1.5 sm:ml-2 font-medium text-gray-900 dark:text-white truncate">{agent.agentName}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <FaQuestionCircle className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="text-gray-500 dark:text-gray-400 hidden xs:inline">Need help?</span>
              <a href="tel:0543370183" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">
                <FaPhone className="w-3 h-3" />
                <span>0543370183</span>
              </a>
            </div>
          </div>
        </div>
      </div>   

      {/* Main Content - Mobile Optimized */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Title */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white text-center mb-4 sm:mb-6">
            Pre Admission Form Entry
          </h1>
          
          {/* School Selection - Compact Mobile Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 lg:gap-4">
            <div 
              className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                formData.school === "Kempshot Grammar Academy" 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md" 
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 active:scale-[0.98]"
              }`}
              onClick={() => setFormData(prev => ({ ...prev, school: "Kempshot Grammar Academy" }))}
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <FaGraduationCap className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 flex-shrink-0 ${
                  formData.school === "Kempshot Grammar Academy" 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-400 dark:text-gray-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-0.5 truncate">
                    Kempshot Grammar Academy
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Basic Education
                  </p>
                </div>
                {formData.school === "Kempshot Grammar Academy" && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div 
              className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                formData.school === "Kempshot Business College" 
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md" 
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 active:scale-[0.98]"
              }`}
              onClick={() => setFormData(prev => ({ ...prev, school: "Kempshot Business College" }))}
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <FaGraduationCap className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 flex-shrink-0 ${
                  formData.school === "Kempshot Business College" 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-gray-400 dark:text-gray-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-0.5 truncate">
                    Kempshot Business College
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Secondary Education
                  </p>
                </div>
                {formData.school === "Kempshot Business College" && (
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Form - Mobile Optimized */}
        <Card extra="p-4 sm:p-6 lg:p-8">
          {/* Note */}
          <div className="mb-4 sm:mb-5 lg:mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
            <p className="text-sm sm:text-base font-medium text-blue-900 dark:text-blue-200">
              <span className="font-semibold">Note:</span> Form submission guarantees your admission.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              {/* Full Name */}
              <div className="lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  <FaUser className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter full name"
                />
              </div>

              {/* Level */}
              <div className="lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  <FaGraduationCap className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              <div className="lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  <FaUser className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="customer@example.com"
                />
              </div>

              {/* Phone Number */}
              <div className="lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  <FaPhone className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>

              {/* Location */}
              <div className="lg:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  <FaMapMarkerAlt className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter location"
                />
              </div>
            </div>

            {/* Submit Button - Mobile Optimized */}
            <div className="flex flex-col items-center pt-4 sm:pt-5 lg:pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? "Processing..." : "Proceed to Payment (GHS 20.00)"}
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Registration fee of GHS 20.00
              </p>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 text-center w-full">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <FaQuestionCircle className="inline w-3 h-3 mr-1" />
                  Need help? Contact us at{" "}
                  <a href="tel:0543370183" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    <FaPhone className="inline w-3 h-3 mr-1" />
                    0543370183
                  </a>
                </p>
              </div>
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
          amount={2000} // GHS 20.00 (2000 pesewas)
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}

      {/* Success Modal - Mobile Optimized */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-5 sm:p-6">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Customer Added Successfully!
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                The customer has been added to {agent.agentName}'s list.
              </p>
              <button
                onClick={handleCloseModal}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium text-sm sm:text-base"
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
