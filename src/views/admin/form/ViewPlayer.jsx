import React, { useEffect, useState } from "react";
import Spinner from "./Spinner"; // Adjust the path as needed

const ViewPlayer = ({ isOpen, onClose, playerData }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-full max-w-2xl p-6 my-8">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          <div className="max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
                Player Profile
              </h2>
              <button
                onClick={onClose}
                className="text-gray-600 dark:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Profile Summary */}
            {playerData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 flex justify-center">
                  {playerData.photo ? (
                    <img
                      src={playerData.photo}
                      alt="Player"
                      className="w-40 h-40 object-cover rounded-full shadow-md"
                    />
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded-full">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    Full Name
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playerData.full_name || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    Age
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playerData.age || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    Date of Birth
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {new Date(playerData.date_of_birth).toLocaleDateString() || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    Class
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playerData.class || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    Contact Number
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playerData.contact_number || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    Current Club
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playerData.current_club || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    Current Club Name
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playerData.current_club_name || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    Declaration
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playerData.declaration ? "Declared" : "Not Declared"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    Email
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playerData.email || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    Location
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playerData.location || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    Height
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playerData.height || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    Has Club Card
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playerData.has_club_card || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    ID
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playerData.id || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">
                    Achievements
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playerData.achievements || "N/A"}
                  </p>
                </div>
                
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">No data available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPlayer;
