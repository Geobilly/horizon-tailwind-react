import Chart from "react-apexcharts";

const LineChart = (props) => {
  const { series, options } = props;

  // Check for dark mode by inspecting the class on the document body or html
  const isDarkMode = document.documentElement.classList.contains("dark");

  const updatedOptions = {
    ...options,
    chart: {
      ...options.chart,
      background: isDarkMode ? '#1B2559' : '#fff',  // navy-800 for dark mode
      foreColor: isDarkMode ? '#fff' : '#333',
    },
    xaxis: {
      ...options.xaxis,
      labels: {
        ...options.xaxis.labels,
        style: {
          ...options.xaxis.labels.style,
          colors: isDarkMode ? '#fff' : '#A3AED0',
        },
      },
      axisBorder: {
        show: true,
        color: isDarkMode ? '#2B3674' : '#E0E0E0'
      },
      axisTicks: {
        show: true,
        color: isDarkMode ? '#2B3674' : '#E0E0E0'
      },
    },
    yaxis: {
      ...options.yaxis,
      labels: {
        ...options.yaxis.labels,
        style: {
          ...options.yaxis.labels.style,
          colors: isDarkMode ? '#fff' : '#A3AED0',
        },
      },
    },
    grid: {
      ...options.grid,
      borderColor: isDarkMode ? '#2B3674' : '#E0E0E0',
      strokeDashArray: 5,
    },
    tooltip: {
      ...options.tooltip,
      theme: isDarkMode ? 'dark' : 'light',
      background: isDarkMode ? '#1B2559' : '#fff',
      style: {
        fontSize: '12px',
        fontFamily: undefined,
      },
    },
    stroke: {
      ...options.stroke,
      curve: 'smooth',
    },
    markers: {
      ...options.markers,
      strokeColors: isDarkMode ? '#1B2559' : '#fff',
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
