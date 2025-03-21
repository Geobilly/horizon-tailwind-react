import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const Scanner = () => {
  const [data, setData] = useState('');

  const handleScan = (result) => {
    if (result) {
      setData(result?.text);
      // Handle the scanned data here
      console.log(result?.text);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  return (
    <div className="scanner-container">
      <h2>QR Code Scanner</h2>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <QrReader
          constraints={{
            facingMode: 'environment'
          }}
          delay={300}
          onResult={handleScan}
          style={{ width: '100%' }}
        />
      </div>
      {data && (
        <div className="result">
          <p>Scanned Result:</p>
          <p>{data}</p>
        </div>
      )}
    </div>
  );
};

export default Scanner; 