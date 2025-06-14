import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "components/card";
import { MdExpandMore, MdExpandLess, MdCheckBox, MdCheckBoxOutlineBlank, MdClose, MdError } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

const RecordPayment = () => {
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [terminals, setTerminals] = useState([]);
  const [isLoadingTerminals, setIsLoadingTerminals] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedStudents, setSelectedStudents] = useState({});
  const [advanceDays, setAdvanceDays] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [selectedStudentCategory, setSelectedStudentCategory] = useState({});
  const [studentCategories, setStudentCategories] = useState([
    {
      id: 'paid',
      title: 'Paid Student',
      icon: '💰',
      students: []
    },
    {
      id: 'sponsor',
      title: 'Sponsor Student',
      icon: '🎓',
      students: []
    },
    {
      id: 'credit',
      title: 'Credit Student',
      icon: '💳',
      students: []
    },
    {
      id: 'boarder',
      title: 'Boarder',
      icon: '🏠',
      students: []
    },
    {
      id: 'advance',
      title: 'Advance Payment',
      icon: '⏩',
      students: []
    }
  ]);

  const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem("Edupay"))?.user;
    return userData || null;
  };

  const getTeacherId = () => {
    const userToken = JSON.parse(localStorage.getItem("Edupay"))?.token;
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      return decodedToken.teacher_id;
    }
    return null;
  };

  useEffect(() => {
    const fetchTerminals = async () => {
      try {
        setIsLoadingTerminals(true);
        const response = await fetch('https://edupaygh-backend.onrender.com/fetchterminal/K-001');
        const data = await response.json();
        setTerminals(data.terminals);
      } catch (error) {
        console.error('Error fetching terminals:', error);
        showToast('Failed to load terminals', 'error');
      } finally {
        setIsLoadingTerminals(false);
      }
    };

    const fetchStudents = async () => {
      const userData = getUserData();
      if (!userData?.classlevel) {
        showToast('Class level not found', 'error');
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`https://edupaygh-backend.onrender.com/fetchstudents/K-001/${userData.classlevel}`);
        const data = await response.json();
        
        // Update student categories with fetched data
        setStudentCategories(prevCategories => prevCategories.map(category => ({
          ...category,
          students: data.students.map(student => ({
            id: student.student_id,
            name: student.student_name,
            class: student.class
          }))
        })));
      } catch (error) {
        console.error('Error fetching students:', error);
        showToast('Failed to load students', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerminals();
    fetchStudents();
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleStudent = (categoryId, studentId) => {
    setSelectedStudents(prev => {
      const newSelected = { ...prev };
      const currentKey = `${categoryId}-${studentId}`;

      // If we're selecting the student
      if (!prev[currentKey]) {
        // Only remove from other categories if not selecting in Advance category
        if (categoryId !== 'advance') {
          Object.keys(prev).forEach(key => {
            const [existingCategoryId, existingStudentId] = key.split('-');
            if (existingStudentId === studentId && existingCategoryId !== 'advance') {
              newSelected[key] = false;
            }
          });
        }
      }

      // Toggle the current selection
      newSelected[currentKey] = !newSelected[currentKey];

      // Update the category tracking
      setSelectedStudentCategory(prev => {
        const newCategory = { ...prev };
        if (newSelected[currentKey]) {
          // For Advance category, don't overwrite existing category
          if (categoryId === 'advance') {
            newCategory[studentId] = newCategory[studentId] || categoryId;
          } else {
            newCategory[studentId] = categoryId;
          }
        } else {
          // Only delete category if it's not Advance
          if (categoryId !== 'advance') {
            delete newCategory[studentId];
          }
        }
        return newCategory;
      });

      return newSelected;
    });
  };

  const selectAllStudents = (categoryId) => {
    const category = studentCategories.find(cat => cat.id === categoryId);
    if (category) {
      setSelectedStudents(prev => {
        const newSelected = { ...prev };
        
        // First, remove all students from other categories
        Object.keys(prev).forEach(key => {
          const [existingCategoryId, existingStudentId] = key.split('-');
          if (existingCategoryId !== categoryId) {
            newSelected[key] = false;
          }
        });
        
        // Then select all students in this category
        category.students.forEach(student => {
          const key = `${categoryId}-${student.id}`;
          newSelected[key] = true;
        });
        
        return newSelected;
      });
    }
  };

  const deselectAllStudents = (categoryId) => {
    const category = studentCategories.find(cat => cat.id === categoryId);
    if (category) {
      setSelectedStudents(prev => {
        const newSelected = { ...prev };
        category.students.forEach(student => {
          const key = `${categoryId}-${student.id}`;
          newSelected[key] = false;
        });
        return newSelected;
      });
    }
  };

  const getSelectedStudentsCount = () => {
    return Object.values(selectedStudents).filter(Boolean).length;
  };

  const getSelectedStudentsByCategory = () => {
    const selectedByCategory = {};
    studentCategories.forEach(category => {
      selectedByCategory[category.id] = category.students.filter(
        student => selectedStudents[`${category.id}-${student.id}`]
      );
    });
    return selectedByCategory;
  };

  const isStudentSelectedInAnyCategory = (studentId) => {
    return Object.entries(selectedStudents).some(([key, isSelected]) => {
      if (!isSelected) return false;
      const [_, existingStudentId] = key.split('-');
      return existingStudentId === studentId;
    });
  };

  const isStudentSelectedInCategory = (categoryId, studentId) => {
    return selectedStudents[`${categoryId}-${studentId}`] === true;
  };

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleSubmit = async () => {
    if (!selectedTerminal) {
      showToast("Please select a terminal first");
      return;
    }
    if (getSelectedStudentsCount() === 0) {
      showToast("Please select at least one student");
      return;
    }

    // Check if all advance students have days entered
    const advanceStudents = getSelectedStudentsByCategory()['advance'] || [];
    const hasInvalidAdvanceDays = advanceStudents.some(student => !getAdvanceDays(student.id));
    if (hasInvalidAdvanceDays) {
      showToast("Please enter number of days for all advance students");
      return;
    }

    setShowModal(true);
  };

  const handleConfirmPayment = async () => {
    try {
      setIsConfirmingPayment(true);
      const userData = JSON.parse(localStorage.getItem("Edupay"));
      const schoolId = userData?.school_id || "K-001";
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      // Prepare data for each selected student
      const entries = [];
      Object.entries(getSelectedStudentsByCategory()).forEach(([categoryId, students]) => {
        students.forEach(student => {
          const entry = {
            school_id: schoolId,
            class: student.class,
            terminal: selectedTerminal.terminal_name,
            entry_date: today,
            amount: categoryId === 'advance' 
              ? parseFloat(selectedTerminal.price) * getAdvanceDays(student.id)
              : categoryId === 'paid'
                ? parseFloat(selectedTerminal.price)
                : 0.00, // For boarder, credit, and sponsor categories
            status: "Pending",
            student_name: student.name,
            paid: categoryId === 'paid' ? "Yes" : "No",
            boarder: categoryId === 'boarder' ? "Yes" : "No",
            sponsor: categoryId === 'sponsor' ? "Yes" : "No",
            number_of_advance: categoryId === 'advance' ? getAdvanceDays(student.id).toString() : "0",
            student_id: student.id,
            credit: categoryId === 'credit' ? "Yes" : "No",
            terminal_price: selectedTerminal.price.toString()
          };
          entries.push(entry);
        });
      });

      // Log the entries data
      console.log("Entries data being sent to API:", JSON.stringify(entries, null, 2));

      // Post data to API
      const response = await fetch('https://edupaygh-backend.onrender.com/addentry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entries)
      });

      const data = await response.json();
      
      if (data.message === "Entries added successfully") {
        showToast("Payment recorded successfully", "success");
        setShowModal(false);
        // Reset selections
        setSelectedStudents({});
        setAdvanceDays({});
        setSelectedStudentCategory({});
      } else {
        showToast("Failed to record payment", "error");
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      showToast("Failed to record payment", "error");
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  const handleAdvanceDaysChange = (studentId, days) => {
    const value = parseInt(days);
    if (!isNaN(value) && value > 0) {
      setAdvanceDays(prev => ({
        ...prev,
        [studentId]: value
      }));
    }
  };

  const getAdvanceDays = (studentId) => {
    return advanceDays[studentId] || '';
  };

  const calculateAdvanceTotal = () => {
    const advanceStudents = getSelectedStudentsByCategory()['advance'] || [];
    return advanceStudents.reduce((total, student) => {
      const days = getAdvanceDays(student.id);
      return total + (parseFloat(selectedTerminal.price) * days);
    }, 0);
  };

  const getTotalAmount = () => {
    let total = 0;
    
    // Calculate for each category
    Object.entries(getSelectedStudentsByCategory()).forEach(([categoryId, students]) => {
      if (categoryId === 'advance') {
        // For advance category, multiply by days
        students.forEach(student => {
          const days = getAdvanceDays(student.id);
          total += parseFloat(selectedTerminal.price) * days;
        });
      } else if (categoryId === 'paid') {
        // For paid category, use regular price
        total += students.length * parseFloat(selectedTerminal.price);
      }
      // For boarder, credit, and sponsor categories, value is 0
    });
    
    return total;
  };

  return (
    <div className="mt-3 p-4 min-h-screen bg-gray-100 dark:bg-navy-900">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-red-200 dark:border-red-800/50 p-4 flex items-center space-x-3">
            <div className="flex-shrink-0">
              <MdError className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-navy-700 dark:text-white">{toast.message}</p>
            <button
              onClick={() => setToast({ show: false, message: "", type: "" })}
              className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
            >
              <MdClose className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white">Record Payment</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Select terminal and students to record payment</p>
      </div>

      {/* Terminal Selection */}
      <Card className="mb-8 bg-white dark:bg-navy-800 shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-4">Select Terminal</h3>
          <div className="relative mb-4">
            {isLoadingTerminals ? (
              <div className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-700 dark:text-white">
                Loading terminals...
              </div>
            ) : (
              <select
                value={selectedTerminal?.id || ""}
                onChange={(e) => {
                  const terminal = terminals.find(t => t.id === parseInt(e.target.value));
                  setSelectedTerminal(terminal);
                }}
                className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-700 dark:text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="">Select a terminal</option>
                {terminals.map((terminal) => (
                  <option key={terminal.id} value={terminal.id}>
                    {terminal.terminal_name} - GH₵ {parseFloat(terminal.price).toFixed(2)}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </Card>

      {/* Student Categories */}
      <Card className="bg-white dark:bg-navy-800 shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-4">Select Students</h3>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-navy-700 dark:text-white">Loading students...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {studentCategories.map((category) => (
                <div key={category.id} className="border border-gray-200 dark:border-navy-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-navy-700/50 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{category.icon}</span>
                      <span className="font-medium text-navy-700 dark:text-white">{category.title}</span>
                      <span className="ml-2 text-sm text-brand-500 font-medium">
                        ({category.students.filter(student => selectedStudents[`${category.id}-${student.id}`]).length} selected)
                      </span>
                    </div>
                    {expandedCategories[category.id] ? (
                      <MdExpandLess className="h-6 w-6 text-navy-700 dark:text-white" />
                    ) : (
                      <MdExpandMore className="h-6 w-6 text-navy-700 dark:text-white" />
                    )}
                  </button>
                  
                  {expandedCategories[category.id] && (
                    <div className="p-4">
                      <div className="flex justify-end space-x-2 mb-3">
                        <button
                          onClick={() => selectAllStudents(category.id)}
                          className="px-3 py-1 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                        >
                          Select All
                        </button>
                        <button
                          onClick={() => deselectAllStudents(category.id)}
                          className="px-3 py-1 text-sm bg-gray-200 dark:bg-navy-700 text-navy-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-navy-600 transition-colors"
                        >
                          Deselect All
                        </button>
                      </div>
                      <div className="space-y-2">
                        {category.students.map((student) => {
                          const isSelectedInOtherCategory = selectedStudentCategory[student.id] && 
                            selectedStudentCategory[student.id] !== category.id && 
                            category.id !== 'advance';
                          const isSelectedInCurrentCategory = selectedStudents[`${category.id}-${student.id}`];

                          return (
                            <div
                              key={student.id}
                              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                                isSelectedInOtherCategory 
                                  ? 'bg-gray-50 dark:bg-navy-700/50 opacity-75' 
                                  : 'hover:bg-gray-50 dark:hover:bg-navy-700/50'
                              }`}
                            >
                              <div className="flex items-center">
                                <div>
                                  <p className="font-medium text-navy-700 dark:text-white">
                                    {student.name.length > 9 
                                      ? `${student.name.substring(0, 9)}...` 
                                      : student.name}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{student.class}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {category.id === 'advance' && selectedStudents[`${category.id}-${student.id}`] && (
                                  <div className="flex items-center space-x-2 mr-2">
                                    <input
                                      type="number"
                                      min="1"
                                      step="1"
                                      value={getAdvanceDays(student.id)}
                                      onChange={(e) => handleAdvanceDaysChange(student.id, e.target.value)}
                                      onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                          e.preventDefault();
                                        }
                                      }}
                                      className="w-24 px-2 py-1 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-700 dark:text-white focus:border-brand-500 focus:outline-none"
                                      placeholder="Enter days"
                                      required
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">days</span>
                                  </div>
                                )}
                                {isSelectedInOtherCategory ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      {category.id === 'advance' ? '' : `Selected in ${studentCategories.find(cat => cat.id === selectedStudentCategory[student.id])?.title}`}
                                    </span>
                                    <MdCheckBox className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => toggleStudent(category.id, student.id)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-navy-600 rounded-lg transition-colors"
                                  >
                                    {isSelectedInCurrentCategory ? (
                                      <MdCheckBox className="h-6 w-6 text-brand-500" />
                                    ) : (
                                      <MdCheckBoxOutlineBlank className="h-6 w-6 text-gray-400" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors flex items-center space-x-2"
        >
          <span>Submit Payment</span>
          <span className="bg-white/20 px-2 py-1 rounded-lg text-sm">
            {getSelectedStudentsCount()} Selected
          </span>
        </button>
      </div>

      {/* Summary Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-800 rounded-2xl w-full max-w-2xl mx-4 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-navy-700 flex justify-between items-center flex-shrink-0">
              <h3 className="text-xl font-bold text-navy-700 dark:text-white">Payment Summary</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
              >
                <MdClose className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-grow">
              {/* Terminal Summary */}
              <div className="bg-gray-50 dark:bg-navy-700/50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Selected Terminal</h4>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-navy-700 dark:text-white">{selectedTerminal.terminal_name}</span>
                  <span className="text-lg font-bold text-brand-500">GH₵ {parseFloat(selectedTerminal.price).toFixed(2)}</span>
                </div>
              </div>

              {/* Students Summary */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Selected Students</h4>
                {studentCategories.map(category => {
                  const selectedStudents = getSelectedStudentsByCategory()[category.id];
                  if (selectedStudents.length === 0) return null;

                  const categoryTotal = category.id === 'advance' 
                    ? selectedStudents.reduce((total, student) => {
                        const days = getAdvanceDays(student.id);
                        return total + (parseFloat(selectedTerminal.price) * days);
                      }, 0)
                    : category.id === 'paid'
                      ? selectedStudents.length * parseFloat(selectedTerminal.price)
                      : 0; // For boarder, credit, and sponsor categories

                  return (
                    <div key={category.id} className="bg-gray-50 dark:bg-navy-700/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{category.icon}</span>
                          <h5 className="font-medium text-navy-700 dark:text-white">{category.title}</h5>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            ({selectedStudents.length} selected)
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-brand-500">
                          GH₵ {categoryTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {selectedStudents.map(student => {
                          const studentAmount = category.id === 'advance'
                            ? parseFloat(selectedTerminal.price) * getAdvanceDays(student.id)
                            : category.id === 'paid'
                              ? parseFloat(selectedTerminal.price)
                              : 0; // For boarder, credit, and sponsor categories

                          return (
                            <div key={student.id} className="flex justify-between items-center text-sm">
                              <div className="flex items-center space-x-2">
                                <span className="text-navy-700 dark:text-white">
                                  {student.name.length > 9 
                                    ? `${student.name.substring(0, 9)}...` 
                                    : student.name}
                                </span>
                                {category.id === 'advance' && (
                                  <span className="text-brand-500 font-medium">
                                    ({getAdvanceDays(student.id)} days)
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="text-gray-500 dark:text-gray-400">{student.class}</span>
                                <span className="text-brand-500 font-medium">
                                  GH₵ {studentAmount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Summary */}
              <div className="border-t border-gray-200 dark:border-navy-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-navy-700 dark:text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-brand-500">
                    GH₵ {getTotalAmount().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-navy-700 flex justify-end space-x-3 flex-shrink-0">
              <button
                onClick={() => setShowModal(false)}
                disabled={isConfirmingPayment}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={isConfirmingPayment}
                className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isConfirmingPayment ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm Payment</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordPayment; 