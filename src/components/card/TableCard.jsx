import React, { useEffect, useState } from 'react';

const TableCard = (props) => {
  const { variant, extra, children, ...rest } = props;

  // State to store the screen width
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth); // Update screen width when window resizes
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define responsive classes based on screen width
  const getResponsiveClasses = () => {
    if (screenWidth <= 640) { // Mobile
      return 'min-w-[320px] max-w-[100%] min-h-[150px] max-h-[70vh]'; // For small screens (phones)
    } else if (screenWidth <= 1024) { // Tablet
      return 'min-w-[600px] max-w-[90%] min-h-[200px] max-h-[75vh]'; // For tablets
    } else { // Desktop
      return 'min-w-[1100px] max-w-[100%] min-h-[200px] max-h-[80vh]'; // For desktops
    }
  };

  return (
    <div
      className={`!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none ${extra} 
        overflow-auto ${getResponsiveClasses()} -ml-8`} // Apply negative margin-left to shift the entire card left
      {...rest}
    >
      {children}
    </div>
  );
};

export default TableCard;
