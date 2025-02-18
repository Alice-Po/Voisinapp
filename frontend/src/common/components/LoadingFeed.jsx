import { Box, Typography } from '@mui/material';

const LoadingFeed = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        padding: 4
      }}
    >
      <img 
        src="/hardwork.gif" 
        alt="Loading..." 
        style={{ 
          width: '200px',
          height: '200px',
          marginBottom: 2
        }} 
      />
      <Typography 
        variant="h6" 
        sx={{ 
          color: 'text.secondary',
          fontStyle: 'italic'
        }}
      >
        Web revolution take time!
      </Typography>
    </Box>
  );
};

export default LoadingFeed; 