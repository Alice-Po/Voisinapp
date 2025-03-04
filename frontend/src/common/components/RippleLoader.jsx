import React from 'react';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  '@keyframes lds-ripple': {
    '0%': {
      top: 36,
      left: 36,
      width: 8,
      height: 8,
      opacity: 0
    },
    '4.9%': {
      top: 36,
      left: 36,
      width: 8,
      height: 8,
      opacity: 0
    },
    '5%': {
      top: 36,
      left: 36,
      width: 8,
      height: 8,
      opacity: 1
    },
    '100%': {
      top: 0,
      left: 0,
      width: 80,
      height: 80,
      opacity: 0
    }
  },
  ripple: {
    color: props => props.color || '#1c4c5b',
    display: 'inline-block',
    position: 'relative',
    width: 80,
    height: 80,
    boxSizing: 'border-box',
    '& div': {
      position: 'absolute',
      border: '4px solid currentColor',
      opacity: 1,
      borderRadius: '50%',
      animation: '$lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      boxSizing: 'border-box',
      '&:nth-child(2)': {
        animationDelay: '-0.5s'
      }
    }
  }
}));

const RippleLoader = ({ color }) => {
  const classes = useStyles({ color });

  return (
    <Box className={classes.ripple} data-testid="ripple-loader">
      <div></div>
      <div></div>
    </Box>
  );
};

export default RippleLoader;
