import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Card from 'components/card';
import { jwtDecode } from 'jwt-decode';

const Scanner = () => {
  const [data, setData] = useState('Waiting for scan...');
  const [selectedTerminal, setSelectedTerminal] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [terminals, setTerminals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get school_id from token
  const getSchoolId = () => {
    const userToken = JSON.parse(localStorage.getItem("Edupay"))?.token;
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      return decodedToken.school_id;
    }
    return null;
  };

  // Fetch terminals from API
  useEffect(() => {
    const fetchTerminals = async () => {
      const schoolId = getSchoolId();
      if (!schoolId) {
        console.error("No school ID found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://edupaygh-backend.onrender.com/fetchterminal/${schoolId}`);
        const data = await response.json();
        
        if (data.terminals) {
          const formattedTerminals = data.terminals.map(terminal => ({
            id: terminal.terminal_name,
            name: terminal.terminal_name,
            price: terminal.price
          }));
          setTerminals(formattedTerminals);
        }
      } catch (error) {
        console.error("Error fetching terminals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerminals();
  }, []);

  useEffect(() => {
    if (!showScanner) return;

    // Create instance of scanner with square dimensions
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,  // Reduced size for better scanning
        height: 250,
      },
      fps: 10,
    });

    const success = (decodedText, decodedResult) => {
      scanner.clear(); // Stop scanning after successful scan
      setShowScanner(false); // Hide scanner
      setData(decodedText);
      console.log('Scanned successfully!:', decodedText);
      // You can handle the scanned data here
      // For example, make an API call with the scanned data
    };

    const error = (err) => {
      console.warn(err);
      // Handle errors here if needed
    };

    scanner.render(success, error);

    return () => {
      scanner.clear().catch(error => {
        console.error('Failed to clear scanner', error);
      });
    };
  }, [showScanner]);

  const handleContinue = () => {
    if (selectedTerminal) {
      setShowScanner(true);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-3 grid h-full">
        <div className="w-full px-[2px] md:px-5">
          <Card extra="!p-[20px] text-center">
            <div className="mb-8 w-full">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                Loading Terminals...
              </h4>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!showScanner) {
    return (
      <div className="mt-3 grid h-full">
        <div className="w-full px-[2px] md:px-5">
          <Card extra="!p-[20px] text-center">
            <div className="mb-8 w-full">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                Select Terminal
              </h4>
            </div>
            
            <div className="max-w-[400px] mx-auto">
              <select
                value={selectedTerminal}
                onChange={(e) => setSelectedTerminal(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:border-navy-400 dark:bg-navy-800 dark:border-navy-600 dark:text-white"
              >
                <option value="">Select a terminal...</option>
                {terminals.map((terminal) => (
                  <option key={terminal.id} value={terminal.id}>
                    {terminal.name} - GH₵{terminal.price}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleContinue}
                disabled={!selectedTerminal}
                className={`px-6 py-2 rounded-lg ${
                  selectedTerminal
                    ? 'bg-navy-700 text-white hover:bg-navy-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 grid h-full">
      <div className="w-full px-[2px] md:px-5">
        <Card extra="!p-[20px] text-center">
          <div className="mb-8 w-full">
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              {terminals.find(t => t.id === selectedTerminal)?.name || 'QR Code Scanner'}
            </h4>
          </div>
          
          <div className="max-w-[800px] mx-auto">
            <style>
              {`
                #reader {
                  width: 100% !important;
                }
                #reader__scan_region {
                  aspect-ratio: 1 !important;
                  position: relative !important;
                  min-height: unset !important;
                }
                #reader__scan_region::before {
                  content: "";
                  display: block;
                  padding-top: 100%;
                }
                #reader__scan_region video {
                  position: absolute !important;
                  top: 0 !important;
                  left: 0 !important;
                  width: 100% !important;
                  height: 100% !important;
                  object-fit: cover !important;
                }
                #reader__camera_selection {
                  margin-bottom: 10px !important;
                }
                #reader__dashboard_section_swaplink {
                  text-decoration: none !important;
                  color: #4318FF !important;
                }
              `}
            </style>
            <div id="reader"></div>
          </div>
          
          <div className="mt-4">
            <p className="text-lg font-medium text-navy-700 dark:text-white">
              Last Scanned Result:
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {data}
            </p>
            {!showScanner && (
              <button
                onClick={() => setShowScanner(true)}
                className="mt-4 px-6 py-2 rounded-lg bg-navy-700 text-white hover:bg-navy-800"
              >
                Scan Again
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Scanner; 