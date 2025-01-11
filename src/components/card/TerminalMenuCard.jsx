import React, { useState } from "react";
import Dropdown from "components/dropdown";
import { AiOutlineUser } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { MdGroupAdd, } from "react-icons/md"; // New icon for Bulk Add
import AddStudent from "../../views/admin/form/AddStudent"; // Import AddStudent component
import BulkAdd from "../../views/admin/form/BulkAdd"; // Import BulkAdd component
import { FaCashRegister } from "react-icons/fa";
import AddTerminal from "../../views/admin/form/AddTerminal"; // Import AddStudent component




function TerminalMenuCard(props) {
  const { transparent } = props;
  const [open, setOpen] = useState(false); // For dropdown
  const [isAddTerminalModalOpen, setIsAddTerminalModalOpen] = useState(false); // For AddStudent modal
//   const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false); // For BulkAdd modal

  const handleOpenAddTerminalModal = () => setIsAddTerminalModalOpen(true);
  const handleCloseAddTerminalModal = () => setIsAddTerminalModalOpen(false);

//   const handleOpenBulkAddModal = () => setIsBulkAddModalOpen(true);
//   const handleCloseBulkAddModal = () => setIsBulkAddModalOpen(false);

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
              onClick={handleOpenAddTerminalModal} // Open AddStudent modal
              className="hover:text-black flex cursor-pointer items-center gap-2 text-gray-600 hover:font-medium"
            >
              <span>
                <FaCashRegister />
              </span>
              Add Terminal
            </p>

            {/* Bulk Add Menu Item */}
            {/* <p
              onClick={handleOpenBulkAddModal} // Open BulkAdd modal
              className="hover:text-black flex cursor-pointer items-center gap-2 text-gray-600 hover:font-medium mt-2"
            >
              <span>
                <MdGroupAdd />
              </span>
              Bulk Add
            </p> */}
          </div>
        }
      />

      {/* Add Student Modal */}
      {isAddTerminalModalOpen && (
        <AddTerminal isOpen={isAddTerminalModalOpen} onClose={handleCloseAddTerminalModal} />
      )}

      {/* Bulk Add Modal */}
      {/* {isBulkAddModalOpen && (
        <BulkAdd isOpen={isBulkAddModalOpen} onClose={handleCloseBulkAddModal} />
      )} */}
    </div>
  );
}

export default TerminalMenuCard;
