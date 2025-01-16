import * as React from 'react';
import PropTypes from 'prop-types';
import BounceLoader from 'react-spinners/BounceLoader'; // Import BounceLoader
import Box from '@mui/material/Box';

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <BounceLoader
        size={props.size || 60} // Loader size with a default
        color={props.color || '#007BFF'} // Default loader color is teal
        loading={true} // Always loading
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Uncomment to show percentage */}
        {/* <Typography
          variant="caption"
          component="div"
          sx={{ color: 'text.secondary' }}
        >
          {`${Math.round(props.value)}%`}
        </Typography> */}
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
  size: PropTypes.number, // Define size prop type
  color: PropTypes.string, // Define color prop type
};

export default function CircularWithValueLabel({ size = 60, color = '#007BFF' }) {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <CircularProgressWithLabel value={progress} size={size} color={color} />;
}
