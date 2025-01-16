import * as React from 'react';
import PropTypes from 'prop-types';
import BounceLoader from 'react-spinners/BounceLoader'; // Import BounceLoader
import Box from '@mui/material/Box';

const Loader = ({ size = 60, color = '#007BFF' }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa', // Optional: Background color
      }}
    >
      <BounceLoader size={size} color={color} loading={true} />
    </Box>
  );
};

Loader.propTypes = {
  size: PropTypes.number, // Define size prop type
  color: PropTypes.string, // Define color prop type
};

export default Loader;
