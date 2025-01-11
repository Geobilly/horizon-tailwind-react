import React from "react";
// import "./styles.css";

const PrintCode = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    const innerCard = document.getElementById("printable-content");
    const originalContent = document.body.innerHTML;

    // Replace body content with the inner card content for printing
    document.body.innerHTML = innerCard.outerHTML;

    // Trigger print
    window.print();

    // Restore original content
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore event listeners
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      {/* Outer Card */}
      <div className="relative flex flex-col justify-start items-start w-[400px] h-auto p-[20px] rounded-[12px] box-border bg-[rgba(255,255,255,1)] border-[1px] border-solid border-[#ddd] shadow-lg">
        {/* Cancel Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={onClose}
            className="text-[16px] font-bold text-[#333] hover:text-[#0071bc] transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Inner Card */}
        <div
          id="printable-content" // Add id for the inner card
          className="relative flex flex-col justify-start items-start w-[336px] h-48 pl-[26px] rounded-[10px] box-border bg-[rgba(255,255,255,1)] border-[1px] border-solid border-[#ddd]"
        >
          {/* Wrapping the content into one parent div */}
          <div className="absolute top-[50px] flex flex-col box-border">
            <div className="flex flex-col pb-1 box-border">
              <p className="text-[17px] relative top-[-16px] text-sm leading-[14px] font-syne font-[700] text-[#0071bcff] mb-2">
                Jhon Doe
              </p>
              <p className="text-[12px] leading-[14px] font-montserrat font-[400] text-[#000000ff] mb-2">
                Class 2
              </p>
              <p className="text-[12px] leading-[14px] font-montserrat font-[400] text-[#000000ff] mb-2">
                K-001-002
              </p>
            </div>
            <div className="flex flex-col w-[100%] box-border">
              <div className="flex flex-row items-center box-border mb-2">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/lh26g9745u-18%3A771?alt=media&token=2e374902-47ca-49db-acff-bb2975f6f6c3"
                  alt="Phone Icon"
                  className="w-2.5 h-full mr-2"
                />
                <p className="text-[12px] leading-[14px] font-inter font-[300] text-[#000000ff]">
                  000-123-456-7890
                </p>
              </div>
              <div className="flex flex-row items-center box-border mb-2">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/lh26g9745u-18%3A766?alt=media&token=ef8039ef-f5a7-4e35-8ebf-8e69e8b7473d"
                  alt="Email Icon"
                  className="w-2.5 h-full mr-2"
                />
                <p className="text-[12px] leading-[14px] font-inter font-[300] text-[#000000ff]">
                  email@yourdomain.com
                </p>
              </div>
              <div className="flex flex-row items-center box-border mb-2">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/lh26g9745u-18%3A760?alt=media&token=683ad378-2e1f-4052-b2c5-6a69b174f66e"
                  alt="Location Icon"
                  className="w-2.5 h-2.5 mr-2"
                />
                <p className="text-[12px] leading-[14px] font-inter font-[300] text-[#000000ff]">
                  Street, USA
                </p>
              </div>
            </div>
          </div>
           
         <div className="absolute left-[184px] w-[163px] h-full box-border">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/lh26g9745u-18%3A403?alt=media&token=90567fd8-99d0-4f32-b6ab-a77f7e4a75e1"
              alt="Decorative Element"
              className="absolute w-[28.65px] h-full"
            />
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/lh26g9745u-18%3A404?alt=media&token=6b68f7c9-08b0-46c7-847f-7d5211f7bc1a"
              alt="Decorative Element"
              className="absolute left-1 w-[31px] h-full"
            />
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/lh26g9745u-18%3A405?alt=media&token=b554570d-801e-4c24-b13e-38de3b0c22fc"
              alt="Decorative Element"
              className="absolute left-2 w-[31px] h-full"
            />
            {/* <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/lh26g9745u-18%3A406?alt=media&token=80121949-4d81-45b6-a750-2374f7fc8c8c"
              alt="Decorative Element"
              className="absolute left-3 w-[151px] h-full rounded-r-[10px] border-r-[3px] border-solid border-[#ddd]"
            /> */}

            <p className="absolute top-[161px] left-10 text-[12px] leading-[14px] font-montserrat font-[400] text-[#000000ff] mb-2 italic">
              Powered by Edupay
            </p>
            <p className="absolute top-[175px] left-10 text-[12px] leading-[14px] font-montserrat font-[400] text-[#000000ff] italic">
              0543370183
            </p>
          </div>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/lh26g9745u-18%3A407?alt=media&token=1de04e37-e9dd-40e6-a11e-3be78f7555ec"
            alt="QR Code"
            className="absolute top-[93px] left-[246px] w-[60px] h-[60px]"
          />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/lh26g9745u-18%3A747?alt=media&token=eb24cc17-f643-4b6f-8595-fa18aa08eb5b"
            alt="Company Logo"
            className="absolute top-[25px] left-[226px] w-[90.65px] h-[43px]"
          />
        </div>
        {/* Print Button */}
        <div className="mt-4 w-full flex justify-center">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#0071bc] text-white rounded-[8px] text-sm font-medium hover:bg-[#005f9e] transition-colors"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintCode;
