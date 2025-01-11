import React from "react";
import { MoonLoader } from "react-spinners";

const Loader = ({ loading, size = 60, color = "#007BFF" }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <MoonLoader color={color} loading={loading} size={size} />
    </div>
  );
};

export default Loader;
