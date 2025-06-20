import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Checkbox from "components/checkbox";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check if the user is already authenticated on page load
  useEffect(() => {
    const adminLoginDetails = localStorage.getItem("Edupay");
    if (adminLoginDetails) {
      navigate("/admin/default"); // Redirect to admin dashboard if already logged in
    }
  }, [navigate]);

  // Function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
  
    // Log the email and password for debugging
    console.log("Email:", email);
    console.log("Password:", password);
  
    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }
  
    setLoading(true); // Start loading when the login process begins
  
    try {
      const response = await fetch("https://edupaygh-backend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Send email and password as JSON
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // Set the error message received from the API
        throw new Error(errorData.error || "An error occurred. Please try again.");
      }
  
      const data = await response.json(); // Parse the JSON response
  
      // Save the API response (token, name, etc.) to localStorage
      localStorage.setItem("Edupay", JSON.stringify(data));
  
      // Reload the page after login
      window.location.reload(); // Reload the page
      
      // Delay navigation to the dashboard after reload
      setTimeout(() => {
        navigate("/admin/default"); // Navigate to admin dashboard after reload
      }, 500); // Delay of 500ms to ensure reload happens first
    } catch (error) {
      // Set the error message from the catch block
      setError(error.message);
    } finally {
      setLoading(false); // Stop loading after the request is completed
    }
  };
  

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
          <div className="rounded-full text-xl">
            <FcGoogle />
          </div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            Sign In with Google
          </h5>
        </div>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white"> or </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>
        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="text"
          value={email} // Bind email state
          onChange={(e) => setEmail(e.target.value)} // Update email state
        />

        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Min. 8 characters"
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="h-5 w-5" />
              ) : (
                <AiOutlineEye className="h-5 w-5" />
              )}
            </button>
          }
        />

        {/* Checkbox */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              Keep me logged 
            </p>
          </div>
          <a
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            href=" "
          >
            Forgot Password?
          </a>
        </div>

        {/* Show error message */}
        {error && (
          <p className="mb-4 text-sm font-medium text-red-500">{error}</p>
        )}

        {/* Show loading spinner */}
        {loading && (
          <div className="flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
            <p className="ml-2 text-sm font-medium text-gray-600">Logging in...</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          onClick={handleLogin} // Call the login function
        >
          Sign In
        </button>
        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <a
            href="/auth/sign-up "
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
