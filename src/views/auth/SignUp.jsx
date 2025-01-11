import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    district: "",
    town: "",
    gps: "",
    contact: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    // Simulate successful registration
    setTimeout(() => {
      setLoading(false);
      alert("Registration successful!");
      navigate("/login"); // Redirect to login page
    }, 2000);
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[600px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">Sign Up</h4>
        <p className="mb-9 ml-1 text-base text-gray-600">Enter your details to sign up!</p>

        <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
          <FcGoogle className="rounded-full text-xl" />
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">Sign Up with Google</h5>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white">or</p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>

        {/* Input Fields */}
        <InputField
          variant="auth"
          label="Name of School*"
          placeholder="Enter school name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <InputField
          variant="auth"
          label="Region*"
          placeholder="Enter region"
          name="region"
          value={formData.region}
          onChange={handleChange}
        />
        <InputField
          variant="auth"
          label="District*"
          placeholder="Enter district"
          name="district"
          value={formData.district}
          onChange={handleChange}
        />
        <InputField
          variant="auth"
          label="Town*"
          placeholder="Enter town"
          name="town"
          value={formData.town}
          onChange={handleChange}
        />
        <InputField
          variant="auth"
          label="Ghana Post Service*"
          placeholder="Enter GPS address"
          name="gps"
          value={formData.gps}
          onChange={handleChange}
        />
        <InputField
          variant="auth"
          label="Contact Number*"
          placeholder="Enter contact number"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
        />
        <InputField
          variant="auth"
          label="Email*"
          placeholder="Enter email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <InputField
          variant="auth"
          label="Password*"
          placeholder="Enter password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="mb-4 flex items-center justify-between px-2">
          <Checkbox />
          <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">Keep me logged In</p>
        </div>

        {error && <p className="mb-4 text-sm font-medium text-red-500">{error}</p>}

        {loading && (
          <div className="flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
            <p className="ml-2 text-sm font-medium text-gray-600">Registering...</p>
          </div>
        )}

        <button
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          onClick={handleSubmit}
        >
          Sign Up
        </button>

        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">Already have an account?</span>
          <a href="/login" className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">Sign In</a>
        </div>
      </div>
    </div>
  );
}
