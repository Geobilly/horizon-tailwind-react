import React, { useState } from "react";
import Dropdown from "components/dropdown";
import { AiOutlineUser } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { MdGroupAdd } from "react-icons/md"; // New icon for Bulk Add
import AddStudent from "../../views/admin/form/AddStudent"; // Import AddStudent component
import BulkAdd from "../../views/admin/form/BulkAdd"; // Import BulkAdd component
import { MdQrCode } from "react-icons/md";  // Import the Qrcode icon


function TotalAmountCardMenu(props) {
  const { transparent } = props;
  const [open, setOpen] = useState(false); // For dropdown
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false); // For AddStudent modal
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false); // For BulkAdd modal

  const handleOpenAddStudentModal = () => setIsAddStudentModalOpen(true);
  const handleCloseAddStudentModal = () => setIsAddStudentModalOpen(false);

  const handleOpenBulkAddModal = () => setIsBulkAddModalOpen(true);
  const handleCloseBulkAddModal = () => setIsBulkAddModalOpen(false);

  return (
    <div>
      {/* Dropdown Menu */}
      <Dropdown
        button={
          <button
            onClick={() => setOpen(!open)}
            className={`flex items-center text-xl hover:cursor-pointer ${
              transparent
                ? "bg-none text-white hover:bg-none active:bg-none"
                : "bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10"
            } linear justify-center rounded-lg font-bold transition duration-200`}
          >
            <BsThreeDots className="h-6 w-6" />
          </button>
        }
        animation={"origin-top-right transition-all duration-300 ease-in-out"}
        classNames={`${transparent ? "top-8" : "top-11"} right-0 w-max`}
        children={
          <div className="z-50 w-max rounded-xl bg-white py-3 px-4 text-sm shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            {/* Add Student Menu Item */}
            <p
              onClick={handleOpenAddStudentModal} // Open AddStudent modal
              className="hover:text-black flex cursor-pointer items-center gap-2 text-gray-600 hover:font-medium"
            >
              <span>
                <AiOutlineUser />
              </span>
              Add Student
            </p>

            {/* Bulk Add Menu Item */}
            <p
              onClick={handleOpenBulkAddModal} // Open BulkAdd modal
              className="hover:text-black flex cursor-pointer items-center gap-2 text-gray-600 hover:font-medium mt-2"
            >
              <span>
                <MdGroupAdd />
              </span>
              Bulk Add
            </p>
            <p
              onClick={handleOpenBulkAddModal} // Open BulkAdd modal
              className="hover:text-black flex cursor-pointer items-center gap-2 text-gray-600 hover:font-medium mt-2"
            >
              <span>
                <MdQrCode />
              </span>
              Bulk Print Qrcode
            </p>
          </div>
        }
      />

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <AddStudent isOpen={isAddStudentModalOpen} onClose={handleCloseAddStudentModal} />
      )}

      {/* Bulk Add Modal */}
      {isBulkAddModalOpen && (
        <BulkAdd isOpen={isBulkAddModalOpen} onClose={handleCloseBulkAddModal} />
      )}
    </div>
  );
}

export default TotalAmountCardMenu;
