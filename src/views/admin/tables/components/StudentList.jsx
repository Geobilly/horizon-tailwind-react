import React, { useMemo, useState, useEffect } from "react";
import CardMenu from "components/card/CardMenu";
import TableCard from "components/card/EntryTableCard";
import EditStudent from "../../form/EditStudent";
import DeleteStudent from "../../form/DeleteStudent";
import PrintCode from "../../form/PrintCode";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { MdQrCode } from "react-icons/md";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { jwtDecode } from "jwt-decode";
import CircularWithValueLabel from "../../../../components/loader/index"; // Import the loader component
import { AiOutlineWarning } from "react-icons/ai"; // Import warning icon
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const StudentList = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPrintCodeModalOpen, setIsPrintCodeModalOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // New loading state
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedStudentForQR, setSelectedStudentForQR] = useState(null);
  const [isBulkQRModalOpen, setIsBulkQRModalOpen] = useState(false);

  const navigate = useNavigate();

  // Decode the token and get the school_id
  const getSchoolId = () => {
    const userToken = JSON.parse(localStorage.getItem("Edupay"))?.token;
    if (userToken) {
      const decodedToken = jwtDecode(userToken);  // Use jwtDecode here
      console.log("Decoded school_id:", decodedToken.school_id);  // Log the school_id
      return decodedToken.school_id;
    }
    return null;
  };

  // Fetch student data from API
  const fetchStudentData = async (schoolId) => {
    setIsLoading(true);  // Start loading
    try {
      const response = await fetch(`https://edupaygh-backend.onrender.com/fetchstudents/${schoolId}`);
      const data = await response.json();
      setFilteredData(data.students);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setIsLoading(false);  // Stop loading
    }
  };

  useEffect(() => {
    const schoolId = getSchoolId();
    if (schoolId) {
      fetchStudentData(schoolId);
    }
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      const schoolId = getSchoolId();
      if (schoolId) fetchStudentData(schoolId);
    } else {
      const filtered = filteredData.filter((student) =>
        student.student_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery]);

  const handleViewClick = (studentId) => {
    if (!studentId) {
      console.error("Student ID is undefined!");
      return;
    }

    console.log("Navigating with studentId:", studentId);
    navigate("/admin/profile", { 
      state: { studentId: studentId }  // Make sure we're passing an object with studentId
    });
  };
  

  const handleCheckboxChange = (student, isChecked) => {
    setSelectedStudents((prev) =>
      isChecked
        ? [...prev, student]
        : prev.filter((s) => s.student_id !== student.student_id)
    );
  };

  const handleEditClick = (studentId) => {
    setSelectedStudentId(studentId);
    setIsEditModalOpen(true);
  };

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

  // Download helper function for single card
  const downloadSingleCard = async (student, elementRef) => {
    try {
      const element = elementRef;
      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [54, 89]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 89, 54);
      pdf.save(`${student.student_name}_ID_Card.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Download helper function for bulk cards (A4 layout)
  const downloadBulkCards = async (students, containerRef) => {
    try {
      const element = containerRef;
      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save('Student_ID_Cards.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // QR Code Modal Component
  const QRCodeModal = ({ student, onClose }) => {
    const qrCodeRef = React.useRef();

    const qrData = JSON.stringify({
      student_id: student.student_id,
      name: student.student_name,
      class: student.class,
      gender: student.gender
    });

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-navy-800 rounded-xl p-6 w-[90%] max-w-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-navy-700 dark:text-white">
              Student ID Card
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          
          <div className="flex flex-col items-center">
            <div 
              className="w-[89mm] h-[54mm] bg-white rounded-lg shadow-lg relative overflow-hidden" 
              ref={qrCodeRef}
            >
              {/* Header */}
              <div className="bg-navy-700 text-white p-2 text-center">
                <h2 className="text-sm font-bold m-0">STUDENT ID CARD</h2>
                <div className="text-xs">KEMPSHOT SCHOOL.</div>
              </div>

              {/* Content */}
              <div className="flex p-3">
                {/* Photo Section */}
                <div className="w-[25mm] mr-3">
                  <div className="w-full h-[30mm] border border-dashed border-navy-700 flex items-center justify-center bg-gray-50">
                    <span className="text-[8px] text-gray-500">Photo</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1">
                  <div className="mb-1">
                    <p className="text-[8px] text-gray-600 m-0">Name</p>
                    <p className="text-[10px] font-semibold text-navy-700 m-0">{student.student_name}</p>
                  </div>
                  <div className="mb-1">
                    <p className="text-[8px] text-gray-600 m-0">Student ID</p>
                    <p className="text-[10px] font-semibold text-navy-700 m-0">{student.student_id}</p>
                  </div>
                  <div className="mb-1">
                    <p className="text-[8px] text-gray-600 m-0">Class</p>
                    <p className="text-[10px] font-semibold text-navy-700 m-0">{student.class}</p>
                  </div>
                  <div className="mb-1">
                    <p className="text-[8px] text-gray-600 m-0">Gender</p>
                    <p className="text-[10px] font-semibold text-navy-700 m-0">{student.gender}</p>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="absolute right-2 bottom-2">
                  <QRCodeSVG
                    value={qrData}
                    size={75}
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 text-center text-[7px] text-gray-600 p-1 bg-gray-50">
                Scan QR code to verify student details
              </div>
            </div>

            <button
              onClick={() => downloadSingleCard(student, qrCodeRef.current)}
              className="mt-4 px-4 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-800"
            >
              Download ID Card as PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Bulk QR Code Modal Component
  const BulkQRCodeModal = ({ students, onClose }) => {
    const containerRef = React.useRef();

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-navy-800 rounded-xl p-6 w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-navy-700 dark:text-white">
              Bulk ID Card Generation
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          {/* A4 Container */}
          <div 
            ref={containerRef}
            className="w-[210mm] mx-auto bg-white p-[10mm]"
            style={{
              minHeight: '297mm',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10mm',
              gridAutoRows: '54mm'
            }}
          >
            {students.map((student) => {
              const qrData = JSON.stringify({
                student_id: student.student_id,
                name: student.student_name,
                class: student.class,
                gender: student.gender
              });

              return (
                <div 
                  key={student.student_id}
                  className="w-[89mm] h-[54mm] bg-white rounded-lg shadow-lg relative overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-navy-700 text-white p-2 text-center">
                    <h2 className="text-sm font-bold m-0">STUDENT ID CARD</h2>
                    <div className="text-xs">SCHOOL NAME HERE</div>
                  </div>

                  {/* Content */}
                  <div className="flex p-3">
                    {/* Photo Section */}
                    <div className="w-[25mm] mr-3">
                      <div className="w-full h-[30mm] border border-dashed border-navy-700 flex items-center justify-center bg-gray-50">
                        <span className="text-[8px] text-gray-500">Photo</span>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1">
                      <div className="mb-1">
                        <p className="text-[8px] text-gray-600 m-0">Name</p>
                        <p className="text-[10px] font-semibold text-navy-700 m-0">{student.student_name}</p>
                      </div>
                      <div className="mb-1">
                        <p className="text-[8px] text-gray-600 m-0">Student ID</p>
                        <p className="text-[10px] font-semibold text-navy-700 m-0">{student.student_id}</p>
                      </div>
                      <div className="mb-1">
                        <p className="text-[8px] text-gray-600 m-0">Class</p>
                        <p className="text-[10px] font-semibold text-navy-700 m-0">{student.class}</p>
                      </div>
                      <div className="mb-1">
                        <p className="text-[8px] text-gray-600 m-0">Gender</p>
                        <p className="text-[10px] font-semibold text-navy-700 m-0">{student.gender}</p>
                      </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="absolute right-2 bottom-2">
                      <QRCodeSVG
                        value={qrData}
                        size={75}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-0 left-0 right-0 text-center text-[7px] text-gray-600 p-1 bg-gray-50">
                    Scan QR code to verify student details
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => downloadBulkCards(students, containerRef.current)}
              className="px-6 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-800"
            >
              Download All ID Cards as PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "STUDENT ID",
        accessor: "student_id",
        Cell: ({ row }) => {
          const student = row.original;
          const isChecked = selectedStudents.some(
            (s) => s.student_id === student.student_id
          );

          return (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleCheckboxChange(student, e.target.checked)}
                className="checkbox-style"
              />
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {student.student_id}
              </p>
            </div>
          );
        },
      },
      { Header: "NAME", accessor: "student_name" },
      { Header: "GENDER", accessor: "gender" },
      { Header: "CLASS", accessor: "class" },
      {
        Header: "ACTION",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <AiOutlineEye
              className="text-blue-500 text-2xl cursor-pointer"
              title="View"
              onClick={() => handleViewClick(row.original.student_id)}
            />
            <AiOutlineEdit
              className={`text-yellow-500 text-2xl ${
                role === "accountant" || role === "teacher" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              title="Edit"
              onClick={() => role !== "accountant" && role !== "teacher" && handleEditClick(row.original.student_id)}
            />
            <AiOutlineDelete
              className={`text-red-500 text-2xl ${
                role === "accountant" || role === "teacher" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              title="Delete"
              onClick={() => role !== "accountant" && role !== "teacher" && setIsDeleteModalOpen(true)}
            />
            <MdQrCode
              className="text-blue-500 text-2xl cursor-pointer"
              title="Generate QR Code"
              onClick={() => {
                setSelectedStudentForQR(row.original);
                setIsQRModalOpen(true);
              }}
            />
          </div>
        ),
      },
    ],
    [navigate, role, selectedStudents]
  );

  const tableInstance = useTable(
    { columns, data: filteredData, initialState: { pageSize: 11 } },
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
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { globalFilter },
    setGlobalFilter,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  return (
    <TableCard extra={"w-full p-4"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">Student</div>
        <div className="flex items-center">
          {selectedStudents.length > 0 && (
            <button
              onClick={() => setIsBulkQRModalOpen(true)}
              className="mr-4 px-4 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-800"
            >
              Generate Selected QR Codes ({selectedStudents.length})
            </button>
          )}
          <CardMenu />
        </div>
      </header>

      <div className="flex justify-between items-center mb-4">
  <input
    type="text"
    value={globalFilter || ""}
    onChange={(e) => setGlobalFilter(e.target.value || undefined)}
    placeholder="Search..."
    className="border p-2 rounded bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>


      {isLoading ? (
        <div className="flex justify-center items-center mt-8">
          <CircularWithValueLabel size={60} />
        </div>
      ) : filteredData.length === 0 ? (
        // If no data is found, show "No Data Available" icon/message
        <div className="flex justify-center items-center mt-8 text-xl text-gray-500">
          <AiOutlineWarning className="text-4xl mr-2" />
          <span>No Data Available</span>
        </div>
      ) : (
        <div className="mt-8" style={{ height: "60vh", overflowY: "auto" }}>
          <table {...getTableProps()} className="w-full">
            <thead className="sticky top-0 bg-white dark:bg-navy-800">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="border-b border-gray-200 pr-8 pb-[10px] text-start dark:!border-navy-700"
                    >
                      <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                        {column.render("Header")}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="pt-[14px] pb-[16px] sm:text-[14px]"
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
      )}

      {/* Pagination controls */}
<div className="flex justify-between items-center mt-4">
  {/* Pagination buttons */}
  <button
    onClick={() => gotoPage(0)}
    disabled={!canPreviousPage}
    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-navy-800 dark:hover:bg-navy-700 dark:disabled:bg-navy-900 dark:disabled:opacity-50 text-navy-700 dark:text-white rounded-md"
  >
    {"<<"}
  </button>
  <button
    onClick={() => previousPage()}
    disabled={!canPreviousPage}
    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-navy-800 dark:hover:bg-navy-700 dark:disabled:bg-navy-900 dark:disabled:opacity-50 text-navy-700 dark:text-white rounded-md"
  >
    {"<"}
  </button>
  <span className="text-sm text-navy-700 dark:text-white">
    Page{" "}
    <strong>
      {pageIndex + 1} of {pageOptions.length}
    </strong>
  </span>
  <button
    onClick={() => nextPage()}
    disabled={!canNextPage}
    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-navy-800 dark:hover:bg-navy-700 dark:disabled:bg-navy-900 dark:disabled:opacity-50 text-navy-700 dark:text-white rounded-md"
  >
    {">"}
  </button>
  <button
    onClick={() => gotoPage(pageCount - 1)}
    disabled={!canNextPage}
    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-navy-800 dark:hover:bg-navy-700 dark:disabled:bg-navy-900 dark:disabled:opacity-50 text-navy-700 dark:text-white rounded-md"
  >
    {">>"}
  </button>
  <select
    value={pageSize}
    onChange={(e) => setPageSize(Number(e.target.value))}
    className="ml-2 border border-gray-300 dark:border-navy-700 rounded-md bg-white dark:bg-navy-800 text-navy-700 dark:text-white"
  >
    {[10, 20, 30, 40, 50].map((size) => (
      <option key={size} value={size}>
        Show {size}
      </option>
    ))}
  </select>
</div>


      <EditStudent
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        studentId={selectedStudentId}
      />
      <DeleteStudent
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
      <PrintCode
        isOpen={isPrintCodeModalOpen}
        onClose={() => setIsPrintCodeModalOpen(false)}
      />

      {/* Add QR Code Modal */}
      {isQRModalOpen && selectedStudentForQR && (
        <QRCodeModal
          student={selectedStudentForQR}
          onClose={() => {
            setIsQRModalOpen(false);
            setSelectedStudentForQR(null);
          }}
        />
      )}

      {/* Add Bulk QR Code Modal */}
      {isBulkQRModalOpen && selectedStudents.length > 0 && (
        <BulkQRCodeModal
          students={selectedStudents}
          onClose={() => setIsBulkQRModalOpen(false)}
        />
      )}
    </TableCard>
  );
};


export default StudentList;
