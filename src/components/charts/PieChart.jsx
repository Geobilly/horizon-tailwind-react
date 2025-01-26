import Chart from "react-apexcharts";

const PieChart = (props) => {
  const { series, options } = props;

  return (
    <div className="relative" style={{ transform: "translateY(40px)" }}>  {/* Move the chart down by 20px */}

    <Chart
      options={options}
      type="pie"
      width="100%"  // You can adjust this value as needed
      height="300"  // Set a fixed height value (in pixels)
      series={series}
    />
        </div>

  );
};

export default PieChart;
