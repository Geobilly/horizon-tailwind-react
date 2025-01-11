import { MdFileUpload } from "react-icons/md";
import Card from "components/card";
import React, { useState } from "react";
import Papa from "papaparse"; // CSV parsing library

const BulkAdd = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile)); // Preview the uploaded file
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  // Return null if the modal is not open
  if (!isOpen) return null;

  return (
    // Modal backdrop
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      {/* Modal content */}
      <Card className="relative grid h-auto w-full max-w-2xl grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-3 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none 2xl:grid-cols-11">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-white text-xl font-bold"
        >
          &times;
        </button>

        {/* File upload section */}
        <div className="col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0 cursor-pointer"
          >
            <MdFileUpload className="text-[80px] text-brand-500 dark:text-white" />
            <h4 className="text-xl font-bold text-brand-500 dark:text-white">
              Upload CSV File
            </h4>
            <p className="mt-2 text-sm font-medium text-gray-600">
              CSV file containing student data (Name, Class, Gender, DOB, etc.)
            </p>
          </label>

          {file && (
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-navy-700 dark:text-white">
                File Selected: {file.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You can now proceed with uploading the data.
              </p>
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="col-span-5 mt-6 flex h-full w-full flex-col justify-center rounded-xl bg-white dark:!bg-navy-800">
          <button
            className="linear mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-6 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            onClick={() => alert("Data will be saved after further validation.")}
          >
            Save Data
          </button>
        </div>
      </Card>
    </div>
  );
};

export default BulkAdd;
