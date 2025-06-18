import React, { useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Download helper function for single card
export const downloadSingleCard = async (student, elementRef) => {
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

// Helper to chunk array
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Download helper function for bulk cards (A4 layout)
export const downloadBulkCards = async (students, containerRef) => {
  try {
    const loadingButton = document.querySelector('#downloadBulkButton');
    if (loadingButton) {
      loadingButton.disabled = true;
      loadingButton.textContent = 'Generating PDF...';
    }

    if (!containerRef) {
      throw new Error('Container reference is missing');
    }

    // Chunk students into groups of 8
    const chunks = chunkArray(students, 8);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Create a temporary hidden container for rendering
    let tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm';
    tempContainer.style.background = 'white';
    document.body.appendChild(tempContainer);

    for (let i = 0; i < chunks.length; i++) {
      // Clear previous content
      tempContainer.innerHTML = '';
      // Create a grid for 8 cards
      const grid = document.createElement('div');
      grid.style.width = '210mm';
      grid.style.minHeight = '297mm';
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      grid.style.gap = '10mm';
      grid.style.gridAutoRows = '54mm';
      grid.style.padding = '10mm';
      grid.style.background = 'white';
      // Render cards
      chunks[i].forEach(student => {
        const card = document.createElement('div');
        card.style.width = '89mm';
        card.style.height = '54mm';
        card.style.background = 'white';
        card.style.borderRadius = '12px';
        card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.innerHTML = `
          <div style="background:#1e293b;color:white;padding:4px;text-align:center;font-weight:bold;font-size:14px;">STUDENT ID CARD<div style='font-size:12px;'>KEMPSHOT SCHOOL</div></div>
          <div style='display:flex;padding:12px;'>
            <div style='width:25mm;margin-right:12px;'>
              ${student.image_data ? `<img src='data:image/png;base64,${student.image_data}' alt='Student' style='width:100%;height:30mm;object-fit:cover;border-radius:8px;border:1px solid #e5e7eb;' />` : `<div style='width:100%;height:30mm;border:1px dashed #1e293b;display:flex;align-items:center;justify-content:center;background:#f9fafb;border-radius:8px;'><span style='font-size:8px;color:#6b7280;'>Photo</span></div>`}
            </div>
            <div style='flex:1;'>
              <div style='margin-bottom:2px;'><span style='font-size:8px;color:#6b7280;'>Name</span><br/><span style='font-size:10px;font-weight:600;color:#1e293b;'>${student.student_name}</span></div>
              <div style='margin-bottom:2px;'><span style='font-size:8px;color:#6b7280;'>Student ID</span><br/><span style='font-size:10px;font-weight:600;color:#1e293b;'>${student.student_id}</span></div>
              <div style='margin-bottom:2px;'><span style='font-size:8px;color:#6b7280;'>Class</span><br/><span style='font-size:10px;font-weight:600;color:#1e293b;'>${student.class}</span></div>
              <div style='margin-bottom:2px;'><span style='font-size:8px;color:#6b7280;'>Gender</span><br/><span style='font-size:10px;font-weight:600;color:#1e293b;'>${student.gender}</span></div>
            </div>
            <div style='position:absolute;right:8px;bottom:8px;'>
              <div id='qrcode-${student.student_id}'></div>
            </div>
          </div>
          <div style='position:absolute;bottom:4px;left:8px;right:8px;text-align:center;font-size:7px;color:#6b7280;padding:2px 0;background:#f9fafb;border-radius:0 0 12px 12px;'>
            Scan QR code to verify student details
          </div>
        `;
        grid.appendChild(card);
      });
      tempContainer.appendChild(grid);
      // Render QR codes using qrcode.react (React can't render here, so use a library or skip QR for this demo)
      // Wait for images to load
      const images = tempContainer.getElementsByTagName('img');
      await Promise.all(Array.from(images).map(img => new Promise(resolve => {
        if (img.complete) resolve(); else { img.onload = resolve; img.onerror = resolve; }
      })));
      // Use html2canvas
      const canvas = await html2canvas(grid, {
        scale: 1.5,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0,
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      if (i === 0) {
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      } else {
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }
    }
    // Remove temp container
    document.body.removeChild(tempContainer);
    pdf.save('Student_ID_Cards.pdf');
    if (loadingButton) {
      loadingButton.disabled = false;
      loadingButton.textContent = 'Download All ID Cards as PDF';
    }
  } catch (error) {
    console.error('Detailed error in PDF generation:', error);
    const loadingButton = document.querySelector('#downloadBulkButton');
    if (loadingButton) {
      loadingButton.disabled = false;
      loadingButton.textContent = 'Download All ID Cards as PDF';
    }
    alert(`Error generating PDF: ${error.message}. Please check the console for more details.`);
  }
};

// QR Code Modal Component
export const QRCodeModal = ({ student, onClose }) => {
  const qrCodeRef = React.useRef();
  const qrData = `STUDENT:${student.student_id}|${student.student_name}|${student.class}|${student.gender}`;

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
            <div className="bg-navy-700 text-white p-2 text-center">
              <h2 className="text-sm font-bold m-0">STUDENT ID CARD</h2>
              <div className="text-xs">KEMPSHOT SCHOOL.</div>
            </div>
            <div className="flex p-3">
              <div className="w-[25mm] mr-3">
                {student.image_data ? (
                  <img
                    src={`data:image/png;base64,${student.image_data}`}
                    alt="Student"
                    className="w-full h-[30mm] object-cover rounded-lg border border-gray-200 dark:border-navy-700"
                    style={{ maxHeight: '30mm', maxWidth: '25mm' }}
                  />
                ) : (
                  <div className="w-full h-[30mm] border border-dashed border-navy-700 flex items-center justify-center bg-gray-50 rounded-lg">
                    <span className="text-[8px] text-gray-500">Photo</span>
                  </div>
                )}
              </div>
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
              <div className="absolute right-2 bottom-2">
                <QRCodeSVG
                  value={qrData}
                  size={100}
                  level="M"
                  includeMargin={true}
                  style={{ background: 'white', padding: '8px' }}
                />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 text-center text-[7px] text-gray-600 p-1 bg-gray-50">
               Property of Kempshot School.
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
export const BulkQRCodeModal = ({ students, onClose }) => {
  const containerRef = React.useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const hiddenContainerRef = React.useRef();

  const handleDownload = async () => {
    setShowHidden(true);
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for DOM update
    await downloadBulkCards(students, hiddenContainerRef.current);
    setShowHidden(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-navy-800 rounded-xl p-6 w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-navy-700 dark:text-white">
              Bulk ID Card Generation
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
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
              const qrData = `STUDENT:${student.student_id}|${student.student_name}|${student.class}|${student.gender}`;
              return (
                <div 
                  key={student.student_id}
                  className="w-[89mm] h-[54mm] bg-white rounded-lg shadow-lg relative overflow-hidden"
                >
                  <div className="bg-navy-700 text-white p-2 text-center">
                    <h2 className="text-sm font-bold m-0">STUDENT ID CARD</h2>
                    <div className="text-xs">KEMPSHOT SCHOOL</div>
                  </div>
                  <div className="flex p-3">
                    <div className="w-[25mm] mr-3">
                      {student.image_data ? (
                        <img
                          src={`data:image/png;base64,${student.image_data}`}
                          alt="Student"
                          className="w-full h-[30mm] object-cover rounded-lg border border-gray-200 dark:border-navy-700"
                          style={{ maxHeight: '30mm', maxWidth: '25mm' }}
                        />
                      ) : (
                        <div className="w-full h-[30mm] border border-dashed border-navy-700 flex items-center justify-center bg-gray-50 rounded-lg">
                          <span className="text-[8px] text-gray-500">Photo</span>
                        </div>
                      )}
                    </div>
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
                    <div className="absolute right-2 bottom-2">
                      <QRCodeSVG
                        value={qrData}
                        size={100}
                        level="M"
                        includeMargin={true}
                        style={{ background: 'white', padding: '8px' }}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 text-center text-[7px] text-gray-600 p-1 bg-gray-50">
                    Property of Kempshot School.
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex justify-center">
            <button
              id="downloadBulkButton"
              onClick={handleDownload}
              className="px-6 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download All ID Cards as PDF
            </button>
          </div>
        </div>
      </div>
      {showHidden && (
        <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm', background: 'white' }}>
          <div
            ref={hiddenContainerRef}
            className="w-[210mm] bg-white p-[10mm]"
            style={{
              minHeight: '297mm',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10mm',
              gridAutoRows: '54mm'
            }}
          >
            {students.map((student) => {
              const qrData = `STUDENT:${student.student_id}|${student.student_name}|${student.class}|${student.gender}`;
              return (
                <div
                  key={student.student_id}
                  className="w-[89mm] h-[54mm] bg-white rounded-lg shadow-lg relative overflow-hidden"
                >
                  <div className="bg-navy-700 text-white p-2 text-center">
                    <h2 className="text-sm font-bold m-0">STUDENT ID CARD</h2>
                    <div className="text-xs">KEMPSHOT SCHOOL</div>
                  </div>
                  <div className="flex p-3">
                    <div className="w-[25mm] mr-3">
                      {student.image_data ? (
                        <img
                          src={`data:image/png;base64,${student.image_data}`}
                          alt="Student"
                          className="w-full h-[30mm] object-cover rounded-lg border border-gray-200 dark:border-navy-700"
                          style={{ maxHeight: '30mm', maxWidth: '25mm' }}
                        />
                      ) : (
                        <div className="w-full h-[30mm] border border-dashed border-navy-700 flex items-center justify-center bg-gray-50 rounded-lg">
                          <span className="text-[8px] text-gray-500">Photo</span>
                        </div>
                      )}
                    </div>
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
                    <div className="absolute right-2 bottom-2">
                      <QRCodeSVG
                        value={qrData}
                        size={100}
                        level="M"
                        includeMargin={true}
                        style={{ background: 'white', padding: '8px' }}
                      />
                    </div>
                  </div>
                  <div style='position:absolute;bottom:4px;left:8px;right:8px;text-align:center;font-size:7px;color:#6b7280;padding:2px 0;background:#f9fafb;border-radius:0 0 12px 12px;'>
                    Scan QR code to verify student details
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}; 