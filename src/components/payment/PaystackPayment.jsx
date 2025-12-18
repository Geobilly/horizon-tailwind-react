import React from 'react';
import { PaystackButton } from 'react-paystack';
import { FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

const PaystackPayment = ({ 
  email, 
  name, 
  phone, 
  onSuccess, 
  onClose,
  amount = 1, // 0.01 GHS (1 pesewa) - FOR TESTING
  publicKey = "pk_live_600b57c273f7236a391db5487282251ec1ff47c0" // Paystack Live Key
}) => {
  
  const componentProps = {
    email,
    amount: amount, // Amount is already in pesewas (smallest currency unit)
    currency: "GHS", // Ghanaian Cedis
    metadata: {
      name,
      phone,
      custom_fields: []
    },
    publicKey,
    text: "Pay Now",
    onSuccess: (reference) => {
      console.log('Payment successful!', reference);
      onSuccess(reference);
    },
    onClose: () => {
      console.log('Payment window closed');
      onClose();
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Payment Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMoneyBillWave className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Payment
          </h2>
          {/* <p className="text-sm text-gray-600 dark:text-gray-400">
            Registration fee to add a new customer
          </p> */}
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Customer Name:</span>
            <span className="font-medium text-gray-900 dark:text-white">{name}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
            <span className="font-medium text-gray-900 dark:text-white">{email}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
            <span className="font-medium text-gray-900 dark:text-white">{phone}</span>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-900 dark:text-white">Amount to Pay:</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                GHS {(amount / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-6">
          <FaShieldAlt className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-800 dark:text-blue-300">
            Your payment is secured by Paystack. We do not store your card details.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <PaystackButton 
            {...componentProps} 
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          />
        </div>

        {/* Additional Info */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
          By proceeding, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
};

export default PaystackPayment;

