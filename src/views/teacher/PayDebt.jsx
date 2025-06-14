import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdExpandMore, MdExpandLess, MdPayment, MdCalendarToday, MdAttachMoney, MdInfo, MdClose, MdSearch, MdVisibility, MdVisibilityOff, MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import CircularWithValueLabel from "components/loader/index";

const PayDebt = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedDebts, setSelectedDebts] = useState([]);
  const [showToast, setShowToast] = useState({ show: false, message: "", type: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [studentsWithDebt, setStudentsWithDebt] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [expandedStudents, setExpandedStudents] = useState({});

  // Get user data from localStorage
  const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem("Edupay"))?.user;
    return userData || null;
  };

  // Fetch students with debt
  const fetchStudentsWithDebt = async () => {
    const userData = getUserData();
    if (!userData) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://edupaygh-backend.onrender.com/fetchallcreditstudentswithclass/K-001/${userData.classlevel}`);
      const data = await response.json();
      
      // Filter only students with "not paid" status
      const unpaidStudents = data.students.filter(student => student.status === "not paid");
      
      // Group students by student ID to combine their debts
      const groupedStudents = unpaidStudents.reduce((acc, student) => {
        if (!acc[student.stu_id]) {
          acc[student.stu_id] = {
            id: student.stu_id,
            name: student.name,
            class: student.class,
            totalDebt: 0,
            debts: []
          };
        }
        
        acc[student.stu_id].debts.push({
          id: student.id,
          component: student.terminal,
          amount: parseFloat(student.terminal_price),
          dueDate: new Date(student.date).toLocaleDateString(),
          status: student.status
        });
        
        acc[student.stu_id].totalDebt += parseFloat(student.terminal_price);
        
        return acc;
      }, {});

      setStudentsWithDebt(Object.values(groupedStudents));
    } catch (error) {
      console.error("Error fetching students with debt:", error);
      setShowToast({
        show: true,
        message: "Error fetching student data",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsWithDebt();
  }, []);

  // Filter students based on search query
  const filteredStudents = studentsWithDebt.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDebtSelection = (debt) => {
    setSelectedDebts(prev => {
      const isSelected = prev.some(d => d.id === debt.id);
      if (isSelected) {
        const newSelected = prev.filter(d => d.id !== debt.id);
        setPaymentAmount(calculateTotal(newSelected).toString());
        return newSelected;
      } else {
        const newSelected = [...prev, debt];
        setPaymentAmount(calculateTotal(newSelected).toString());
        return newSelected;
      }
    });
  };

  const calculateTotal = (debts) => {
    return debts.reduce((total, debt) => total + parseFloat(debt.amount), 0);
  };

  const handlePayment = async () => {
    if (selectedDebts.length === 0) {
      setShowToast({
        show: true,
        message: "Please select at least one debt to pay",
        type: "error"
      });
      return;
    }

    try {
      setIsProcessingPayment(true);
      
      // Get the IDs of selected debts
      const selectedIds = selectedDebts.map(debt => debt.id);
      
      // Prepare request body based on number of selected items
      const requestBody = selectedIds.length === 1 
        ? { id: selectedIds[0] }  // Single ID format
        : { ids: selectedIds };   // Multiple IDs format
      
      // Make the API call
      const response = await fetch('https://edupaygh-backend.onrender.com/updatecreditstatus', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
        setShowToast({
          show: true,
          message: data.message || `Successfully updated ${selectedIds.length} student(s) to 'pending' status`,
          type: "success"
        });

        // Close modal and reset states
        setShowPaymentModal(false);
        setPaymentAmount("");
        setSelectedDebts([]);
        
        // Refresh the student list
        fetchStudentsWithDebt();
      } else {
        throw new Error(data.message || 'Failed to update payment status');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setShowToast({
        show: true,
        message: error.message || "Failed to process payment. Please try again.",
        type: "error"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const toggleStudentExpansion = (studentId) => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSelectAll = () => {
    if (selectedDebts.length === selectedStudent.debts.length) {
      // If all are selected, deselect all
      setSelectedDebts([]);
      setPaymentAmount("0");
    } else {
      // If not all are selected, select all
      setSelectedDebts(selectedStudent.debts);
      setPaymentAmount(calculateTotal(selectedStudent.debts).toString());
    }
  };

  if (isLoading) {
    return (
      <div className="mt-3 p-4 min-h-screen bg-gray-100 dark:bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <CircularWithValueLabel size={60} />
          <p className="mt-4 text-navy-700 dark:text-white">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 p-4 min-h-screen bg-gray-100 dark:bg-navy-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white">Student Debt Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage student debt payments</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or class..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-700 dark:text-white focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Students List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="bg-white dark:bg-navy-800 shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-navy-700 dark:text-white">{student.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{student.class}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Debt</p>
                  <p className="text-xl font-bold text-red-500">GH₵ {student.totalDebt.toFixed(2)}</p>
                </div>
              </div>

              {/* View/Hide Button */}
              <button
                onClick={() => toggleStudentExpansion(student.id)}
                className="w-full py-2 mb-4 bg-gray-50 dark:bg-navy-700/50 text-navy-700 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors flex items-center justify-center space-x-2"
              >
                {expandedStudents[student.id] ? (
                  <>
                    <MdVisibilityOff className="h-5 w-5" />
                    <span>Hide Records</span>
                  </>
                ) : (
                  <>
                    <MdVisibility className="h-5 w-5" />
                    <span>View Records</span>
                  </>
                )}
              </button>

              {/* Debt Components - Only shown when expanded */}
              {expandedStudents[student.id] && (
                <div className="space-y-3">
                  {student.debts.map((debt) => (
                    <div
                      key={debt.id}
                      className="bg-gray-50 dark:bg-navy-700/50 rounded-xl p-4 flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-brand-500/10 flex items-center justify-center">
                          <MdAttachMoney className="h-5 w-5 text-brand-500" />
                        </div>
                        <div>
                          <p className="font-medium text-navy-700 dark:text-white">{debt.component}</p>
                          <div className="flex items-center space-x-2 text-sm">
                            <MdCalendarToday className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">Date: {debt.dueDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-navy-700 dark:text-white">GH₵ {debt.amount.toFixed(2)}</p>
                        <span className="text-sm text-red-500">Not Paid</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={() => {
                  setSelectedStudent(student);
                  setShowPaymentModal(true);
                }}
                className="mt-4 w-full py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors flex items-center justify-center space-x-2"
              >
                <MdPayment className="h-5 w-5" />
                <span>Make Payment</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-navy-800 rounded-2xl w-full max-w-[95vw] sm:max-w-md mx-auto my-4 sm:my-8 shadow-2xl">
            <div className="p-3 sm:p-4 md:p-6">
              {/* Header - Fixed */}
              <div className="sticky top-0 bg-white dark:bg-navy-800 pb-3 sm:pb-4 z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-navy-700 dark:text-white">Make Payment</h3>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentAmount("");
                      setSelectedDebts([]);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
                  >
                    <MdClose className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                  </button>
                </div>
              </div>
              
              {/* Scrollable Content */}
              <div className="space-y-3 sm:space-y-4 max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-10rem)] overflow-y-auto pr-1 sm:pr-2">
                {/* Student Info */}
                <div className="bg-gray-50 dark:bg-navy-700/50 rounded-xl p-2.5 sm:p-3 md:p-4">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-0.5 sm:mb-1">Student</p>
                  <p className="font-medium text-navy-700 dark:text-white text-sm sm:text-base md:text-lg truncate">{selectedStudent.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{selectedStudent.class}</p>
                </div>

                {/* Total Debt */}
                <div className="bg-gray-50 dark:bg-navy-700/50 rounded-xl p-2.5 sm:p-3 md:p-4">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-0.5 sm:mb-1">Total Debt</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-500">GH₵ {selectedStudent.totalDebt.toFixed(2)}</p>
                </div>

                {/* Debt Selection */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select Debts to Pay
                    </label>
                    <button
                      onClick={handleSelectAll}
                      className="text-xs sm:text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 flex items-center space-x-1"
                    >
                      {selectedDebts.length === selectedStudent.debts.length ? (
                        <>
                          <MdCheckBox className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Deselect All</span>
                        </>
                      ) : (
                        <>
                          <MdCheckBoxOutlineBlank className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Select All</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 max-h-[20vh] sm:max-h-[25vh] md:max-h-[30vh] overflow-y-auto pr-1 sm:pr-2">
                    {selectedStudent.debts.map((debt) => {
                      const isSelected = selectedDebts.some(d => d.id === debt.id);
                      return (
                        <div
                          key={debt.id}
                          className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-navy-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700"
                          onClick={() => handleDebtSelection(debt)}
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            {isSelected ? (
                              <MdCheckBox className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 flex-shrink-0" />
                            ) : (
                              <MdCheckBoxOutlineBlank className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-navy-700 dark:text-white text-xs sm:text-sm md:text-base truncate">{debt.component}</p>
                              <div className="flex items-center space-x-1 sm:space-x-2 text-xs">
                                <MdCalendarToday className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-400">Date: {debt.dueDate}</span>
                              </div>
                            </div>
                          </div>
                          <p className="font-semibold text-navy-700 dark:text-white text-xs sm:text-sm md:text-base ml-2 flex-shrink-0">GH₵ {debt.amount.toFixed(2)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Items Summary */}
                {selectedDebts.length > 0 && (
                  <div className="bg-gray-50 dark:bg-navy-700/50 rounded-xl p-2.5 sm:p-3 md:p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Selected Items</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{selectedDebts.length} items selected</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                        <p className="text-base sm:text-lg md:text-xl font-bold text-brand-500">GH₵ {calculateTotal(selectedDebts).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Amount */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Payment Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">GH₵</span>
                    <input
                      type="text"
                      value={`${calculateTotal(selectedDebts).toFixed(2)}`}
                      readOnly
                      className="w-full pl-8 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 rounded-xl border-2 border-gray-200 dark:border-navy-700 bg-gray-50 dark:bg-navy-700 text-navy-700 dark:text-white cursor-not-allowed text-xs sm:text-sm md:text-base"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Amount automatically calculated based on selected items
                  </p>
                </div>
              </div>

              {/* Action Buttons - Fixed at bottom */}
              <div className="sticky bottom-0 bg-white dark:bg-navy-800 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200 dark:border-navy-700">
                <div className="flex justify-end space-x-2 sm:space-x-3">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentAmount("");
                      setSelectedDebts([]);
                    }}
                    disabled={isProcessingPayment}
                    className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <CircularWithValueLabel size={20} />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Confirm Payment</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`bg-white dark:bg-navy-800 rounded-xl shadow-lg border ${
            showToast.type === "error" ? "border-red-200 dark:border-red-800/50" : "border-green-200 dark:border-green-800/50"
          } p-4 flex items-center space-x-3`}>
            <div className="flex-shrink-0">
              {showToast.type === "error" ? (
                <MdInfo className="h-6 w-6 text-red-500" />
              ) : (
                <MdInfo className="h-6 w-6 text-green-500" />
              )}
            </div>
            <p className="text-navy-700 dark:text-white">{showToast.message}</p>
            <button
              onClick={() => setShowToast({ show: false, message: "", type: "" })}
              className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
            >
              <MdClose className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayDebt; 