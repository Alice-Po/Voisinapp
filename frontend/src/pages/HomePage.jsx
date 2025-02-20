import React, { useState, useEffect } from 'react';
import { useGetIdentity, useTranslate, Link, useRedirect, LocalesMenuButton } from 'react-admin';
import { Box, Button, Typography, ThemeProvider, Alert } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import theme from '../config/theme';
import WelcomeDialog from '../common/components/WelcomeDialog';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `radial-gradient(circle at 50% 14em, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
  },
  title: {
    lineHeight: 1,
    color: 'white',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.8em'
    }
  },
  description: {
    color: 'white',
    fontStyle: 'italic',
    paddingTop: 12,
    whiteSpace: 'pre-line',
    maxWidth: 600,
    textAlign: 'center'
  },
  link: {
    textDecoration: 'underline',
    color: 'white'
  },
  logo: {
    width: 150,
    marginBottom: 20,
    filter: 'brightness(0) invert(1)'
  },
  button: {
    margin: 5,
    borderRadius: 20,
    textTransform: 'none'
  }
}));

const HomePage = () => {
  const classes = useStyles();
  const redirect = useRedirect();
  const { data: identity, isLoading } = useGetIdentity();
  const translate = useTranslate();
  const [showWelcome, setShowWelcome] = useState(true);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('welcomeShown', 'true');
  };

  if (isLoading) return null;

  return (
    <ThemeProvider theme={theme}>
      {showWelcome ? (
        <WelcomeDialog open={true} onClose={handleCloseWelcome} />
      ) : (
        <Box className={classes.root}>
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <LocalesMenuButton />
          </Box>

          <img src="/logo-transparent.png" alt="VoisinApp Logo" className={classes.logo} />

          <Typography variant="h3" component="h1" className={classes.title} gutterBottom>
            {translate('app.welcome')}
          </Typography>

          <Typography className={classes.description}>{translate('app.description')}</Typography>

          {import.meta.env.VITE_ORGANIZATION_NAME && (
            <a
              href={import.meta.env.VITE_ORGANIZATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              <Typography className={classes.description}>
                {translate('app.backed_by_organization', {
                  organizationName: import.meta.env.VITE_ORGANIZATION_NAME
                })}
              </Typography>
            </a>
          )}

          <Box display="flex" pt={3} pb={3} alignItems="center">
            <Link to="/login?signup">
              <Button variant="contained" color="secondary" className={classes.button}>
                {translate('auth.action.signup')}
              </Button>
            </Link>
            &nbsp;&nbsp;
            <Link to="/login">
              <Button variant="contained" color="secondary" className={classes.button}>
                {translate('ra.auth.sign_in')}
              </Button>
            </Link>
          </Box>

          <Alert
            variant="filled"
            severity="warning"
            sx={{
              ml: 3,
              mr: 3,
              maxWidth: 350,
              backgroundColor: '#f57c00'
            }}
          >
            {translate('app.message.early_dev_warning')}{' '}
            <a
              href="https://github.com/Alice-Po/Voisinapp"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white' }}
            >
              GitHub
            </a>
          </Alert>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default HomePage;
