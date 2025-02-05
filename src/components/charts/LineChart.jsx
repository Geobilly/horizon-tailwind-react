import Chart from "react-apexcharts";

const LineChart = (props) => {
  const { series, options } = props;

  // Check for dark mode by inspecting the class on the document body or html
  const isDarkMode = document.documentElement.classList.contains("dark");

  const updatedOptions = {
    ...options,
    xaxis: {
      ...options.xaxis,
      labels: {
        ...options.xaxis.labels,
        style: {
          ...options.xaxis.labels.style,
          color: isDarkMode ? "#E0E0E0" : "#A3AED0", // Light gray in dark mode, default color in light mode
        },
      },
    },
    yaxis: {
      ...options.yaxis,
      labels: {
        ...options.yaxis.labels,
        style: {
          ...options.yaxis.labels.style,
          color: isDarkMode ? "#E0E0E0" : "#A3AED0", // Light gray in dark mode, default color in light mode
        },
      },
    },
    tooltip: {
      ...options.tooltip,
      theme: isDarkMode ? "dark" : "light", // Adjust tooltip theme
    },
  };

  return (
    <Chart
      options={updatedOptions}
      type="line"
      width="100%"
      height="100%"
      series={series}
    />
  );
};

export default LineChart;
