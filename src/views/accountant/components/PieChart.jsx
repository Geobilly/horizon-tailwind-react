import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { MdCalendarToday, MdAttachMoney, MdInfoOutline } from 'react-icons/md';
import Card from "components/card";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PieChart = ({ data, loading }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [chartData, setChartData] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    if (data) {
      // Filter data for selected date
      const filteredData = data.filter(item => item.date === selectedDate);
      
      // Calculate total revenue
      const total = filteredData.reduce((sum, item) => sum + item.totalAmount, 0);
      setTotalRevenue(total);
      
      // Check if we have any non-zero revenue data
      const hasNonZeroRevenue = filteredData.some(item => item.totalAmount > 0);
      setHasData(hasNonZeroRevenue);

      if (hasNonZeroRevenue) {
        // Get unique terminals and calculate totals
        const terminals = [...new Set(filteredData.map(item => item.terminal))];
        const totals = filteredData.reduce((acc, item) => {
          acc[item.terminal] = (acc[item.terminal] || 0) + item.totalAmount;
          return acc;
        }, {});

        // Generate colors for each terminal
        const generateColors = (count) => {
          const colors = [
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
          ];
          return colors.slice(0, count);
        };

        // Prepare chart data
        setChartData({
          labels: terminals.map(terminal => `${terminal.charAt(0).toUpperCase() + terminal.slice(1)} Revenue`),
          datasets: [
            {
              data: terminals.map(terminal => totals[terminal] || 0),
              backgroundColor: generateColors(terminals.length),
              borderColor: generateColors(terminals.length).map(color => color.replace('0.8', '1')),
              borderWidth: 1,
            },
          ],
        });
      } else {
        setChartData(null);
      }
    }
  }, [data, selectedDate]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14,
            family: "'Inter', sans-serif",
          },
          color: '#1B2541',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: GH₵ ${value.toLocaleString()} (${percentage}%)`;
          }
        },
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1B2541',
        bodyColor: '#1B2541',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        displayColors: true,
        boxPadding: 6,
      },
    },
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <Card className="bg-white dark:bg-navy-800 shadow-lg">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              Revenue Distribution
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Daily revenue breakdown by terminal
            </p>
          </div>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              max={new Date().toISOString().split('T')[0]}
              className="pl-10 pr-4 py-2 text-sm font-medium text-navy-700 dark:text-white bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-colors"
            />
            <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-navy-700 dark:text-white" />
          </div>
        </div>

        {/* Total Revenue Display */}
        <div className="mb-8 bg-white dark:bg-navy-700 rounded-xl p-6 border border-gray-100 dark:border-navy-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg">
                  <MdAttachMoney className="h-5 w-5 text-brand-500 dark:text-brand-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              </div>
              <h3 className="text-2xl font-bold text-navy-700 dark:text-white mt-2">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-navy-600 h-8 w-48 rounded"></div>
                ) : (
                  `GH₵ ${totalRevenue.toLocaleString()}`
                )}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">For {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
        ) : hasData && chartData ? (
          <div className="h-80">
            <Pie data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="bg-gray-50 dark:bg-navy-700 p-4 rounded-full">
              <MdInfoOutline className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
                No Revenue Data Available
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                There are no transactions recorded for{' '}
                <span className="font-medium text-brand-500">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Try selecting a different date or check back later for updates
              </p>
            </div>
          </div>
        )}

        {hasData && chartData && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {chartData.labels.map((label, index) => (
              <div key={label} className="bg-gray-50 dark:bg-navy-700 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</h5>
                <p className="text-xl font-bold text-navy-700 dark:text-white mt-1">
                  GH₵ {chartData.datasets[0].data[index].toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PieChart; 