import Card from "components/card";
import React from "react";
import QRCode from "react-qr-code";

const Storage = () => {
  return (
    <Card extra={"w-full h-full p-4"}>
      <div className="flex flex-col items-center justify-center h-full overflow-hidden">
        <div className="mt-2 p-4 bg-lightPrimary dark:!bg-navy-700 rounded-lg shadow-md">
          <QRCode
            value="https://example.com"
            size={200} // Reduced size for the QR code
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
          />
        </div>
        <h4 className="mt-6 text-2xl font-bold text-navy-700 dark:text-white">
          Student QR Code
        </h4>
        {/* <p className="px-5 mt-2 text-center text-base font-normal text-gray-600 md:!px-0 xl:!px-8">
          Use your device to scan and access the link instantly.
        </p> */}
      </div>
    </Card>
  );
};

export default Storage;
