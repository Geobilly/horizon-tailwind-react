import React, { useRef } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ agentId, agentName, agentLocation }) => {
  const canvasRef = useRef(null);

  const generateAndDownloadQR = async () => {
    try {
      // Generate the URL for adding a customer for this agent
      const baseUrl = window.location.origin;
      const addCustomerUrl = `${baseUrl}/empty/agents/${agentId}/add-customer?agentId=${agentId}&agentName=${encodeURIComponent(agentName)}&agentLocation=${encodeURIComponent(agentLocation)}`;

      // Create a temporary canvas
      const canvas = document.createElement('canvas');
      
      // Generate QR code on the canvas with higher quality
      await QRCode.toCanvas(canvas, addCustomerUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Create a larger canvas with agent info
      const finalCanvas = document.createElement('canvas');
      const ctx = finalCanvas.getContext('2d');
      
      // Set final canvas size (QR code + text area)
      finalCanvas.width = 400;
      finalCanvas.height = 500;
      
      // Fill background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      
      // Draw QR code
      ctx.drawImage(canvas, 0, 0);
      
      // Add agent information text below QR code
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Agent QR Code', finalCanvas.width / 2, 430);
      
      ctx.font = '16px Arial';
      ctx.fillText(agentName, finalCanvas.width / 2, 455);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666666';
      ctx.fillText(agentLocation, finalCanvas.width / 2, 475);
      ctx.fillText(`ID: ${agentId}`, finalCanvas.width / 2, 495);
      
      // Convert canvas to blob and download
      finalCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `agent-${agentId}-${agentName.replace(/\s+/g, '-')}-qrcode.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });

    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code. Please try again.');
    }
  };

  return { generateAndDownloadQR };
};

export default QRCodeGenerator;

