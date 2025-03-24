import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Card from 'components/card';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Scanner = () => {
  const [data, setData] = useState('Waiting for scan...');
  const [selectedTerminal, setSelectedTerminal] = useState('');
  const [terminalAmount, setTerminalAmount] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [terminals, setTerminals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [scanner, setScanner] = useState(null);

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

  // Function to play success beep
  const playSuccessBeep = () => {
    const audio = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');
    audio.play();
  };

  // Function to show temporary success message
  const showTemporaryMessage = (message) => {
    setApiResponse({ message });
    setTimeout(() => {
      setApiResponse(null);
    }, 3000);
  };

  useEffect(() => {
    if (!showScanner) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    const success = async (decodedText, decodedResult) => {
      try {
        console.log('Raw QR Code Data:', decodedText);

        let id, name, className;

        // Handle both old and new QR code formats
        if (decodedText.startsWith('STUDENT:')) {
          // New Format: STUDENT:K-001-002|Jeffery Bukuroh|Class 1|male
          const rawData = decodedText.replace('STUDENT:', '');
          [id, name, className] = rawData.split('|');
        } else {
          // Old Format: ID: K-001-002, Name: Jeffery Bukuroh, Class: Class 1
          try {
            const matches = decodedText.match(/ID:\s*(.*?),\s*Name:\s*(.*?),\s*Class:\s*(.*)/);
            if (matches) {
              [, id, name, className] = matches;
              // Trim whitespace from extracted values
              id = id.trim();
              name = name.trim();
              className = className.trim();
            } else {
              throw new Error('Invalid old format');
            }
          } catch (parseError) {
            console.error('Error parsing QR code:', parseError);
            setError('Invalid QR Code Format');
            return;
          }
        }

        // Validate that we have all required data
        if (!id || !name || !className) {
          console.error('Missing data:', { id, name, className });
          setError('Missing required student information');
          return;
        }

        console.log('Parsed Student Data:', {
          id,
          name,
          className
        });

        // Get selected terminal details
        const terminal = terminals.find(t => t.id === selectedTerminal);
        
        if (!terminal) {
          console.error('Terminal not found');
          setError('Terminal not found');
          return;
        }

        // Prepare transaction data (same format for both old and new QR codes)
        const transactionData = {
          student_id: id,
          student_name: name,
          class: className,
          terminal: terminal.name,
          amount: terminal.price
        };

        console.log('Sending transaction data:', transactionData);

        try {
          const response = await axios.post('https://edupaygh-backend.onrender.com/debit', transactionData);
          
          // Play success beep
          playSuccessBeep();
          
          // Show success message with transaction details
          const successMessage = {
            type: 'success',
            message: response.data.message,
            details: {
              name: response.data.transaction_details.student_name,
              amount: Math.abs(response.data.transaction_details.amount),
              terminal: response.data.transaction_details.terminal
            }
          };
          setApiResponse(successMessage);
          setTimeout(() => setApiResponse(null), 3000);

        } catch (apiError) {
          console.error('API Error:', apiError);
          
          // Handle specific error responses
          let errorMessage = '';
          if (apiError.response) {
            switch (apiError.response.data.error) {
              case 'Transaction not allowed. Similar transaction exists within 24 hours':
                errorMessage = 'This student has already used this terminal in the last 24 hours';
                break;
              case 'Low balance':
                errorMessage = 'Insufficient balance for this transaction';
                break;
              case 'Low balance or invalid terminal':
                errorMessage = 'Invalid terminal or insufficient balance';
                break;
              case 'Could not fetch student balance':
                errorMessage = 'Unable to verify student balance';
                break;
              default:
                errorMessage = apiError.response.data.error || 'Failed to process transaction';
            }
          } else if (apiError.message.includes('Network Error')) {
            errorMessage = 'Cannot connect to server. Please check if the server is running.';
          } else {
            errorMessage = 'An unexpected error occurred';
          }

          setError(errorMessage);
          setTimeout(() => setError(null), 3000);
        }
      } catch (error) {
        console.error('QR Code Processing Error:', error);
        setError('Error processing QR code');
        setTimeout(() => setError(null), 3000);
      }
    };

    const error = (err) => {
      console.warn(err);
    };

    scanner.render(success, error);
    setScanner(scanner);

    return () => {
      scanner.clear().catch(error => {
        console.error('Failed to clear scanner', error);
      });
    };
  }, [showScanner, selectedTerminal, terminals]);

  const handleContinue = () => {
    if (selectedTerminal) {
      const terminal = terminals.find(t => t.id === selectedTerminal);
      if (terminal) {
        setTerminalAmount(terminal.price);
        setShowScanner(true);
      }
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
              {terminals.find(t => t.id === selectedTerminal)?.name} - Scanning Mode
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
          
          <div className="mt-8">
            {error && (
              <div className="text-red-500 mb-4">
                {error}
              </div>
            )}
            
            {apiResponse && (
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-4">
                <p className="text-green-700 dark:text-green-300">
                  {apiResponse.message}
                </p>
                {apiResponse.details && (
                  <div className="mt-2 text-sm">
                    <p>Student: {apiResponse.details.name}</p>
                    <p>Amount: GH₵{apiResponse.details.amount}</p>
                    <p>Terminal: {apiResponse.details.terminal}</p>
                  </div>
                )}
              </div>
            )}

            {!showScanner && (
              <button
                onClick={() => {
                  setShowScanner(true);
                  setApiResponse(null);
                  setError(null);
                }}
                className="mt-6 px-6 py-2 rounded-lg bg-navy-700 text-white hover:bg-navy-800"
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