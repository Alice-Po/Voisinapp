import React, { useState, useEffect } from 'react';
import { useGetIdentity, useTranslate, Link, useRedirect, LocalesMenuButton } from 'react-admin';
import { Box, Button, Typography, ThemeProvider, Alert } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import LockIcon from '@mui/icons-material/Lock';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import theme from '../config/theme';
import WelcomeDialog from '../common/components/WelcomeDialog';
import RippleLoader from '../common/components/RippleLoader';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `radial-gradient(circle at 50% 14em, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    padding: '20px 0'
  },
  title: {
    lineHeight: 1,
    color: 'white',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.8em'
    }
  },
  tagline: {
    color: 'white',
    fontSize: '1.4rem',
    fontWeight: 500,
    maxWidth: 800,
    textAlign: 'center',
    margin: '1rem 0 2rem',
    padding: '0 20px',
    lineHeight: 1.4
  },
  featuresSection: {
    color: 'white',
    maxWidth: 800,
    textAlign: 'center',
    padding: '0 20px'
  },
  featureTitle: {
    fontSize: '1.2rem',
    fontWeight: 500,
    marginBottom: '0.5rem',
    marginTop: '1rem'
  },
  featureList: {
    fontSize: '1rem',
    fontStyle: 'italic',
    '& > *': {
      margin: '0.3rem 0'
    }
  },
  description: {
    color: 'white',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: '1rem'
  },
  link: {
    textDecoration: 'underline',
    color: 'white'
  },
  logo: {
    width: 120,
    marginBottom: 20,
    filter: 'brightness(0) invert(1)'
  },
  button: {
    margin: 5,
    borderRadius: 20,
    textTransform: 'none'
  },
  warningBanner: {
    width: '100%',
    backgroundColor: '#f57c00',
    color: 'white',
    padding: '8px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    '& a': {
      color: 'white',
      fontWeight: 'bold',
      textDecoration: 'underline',
      '&:hover': {
        color: 'rgba(255, 255, 255, 0.8)'
      }
    },
    '& svg': {
      fontSize: '20px'
    }
  }
}));

const HomePage = () => {
  const classes = useStyles();
  const redirect = useRedirect();
  const { data: identity, isLoading } = useGetIdentity();
  const translate = useTranslate();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (!isLoading && identity?.id) {
      redirect('/home');
    }
  }, [identity, isLoading, redirect]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('welcomeShown', 'true');
  };

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <RippleLoader />
      </Box>
    );

  const featureIndices = [0, 1, 2];

  return (
    <ThemeProvider theme={theme}>
      {showWelcome ? (
        <WelcomeDialog open={true} onClose={handleCloseWelcome} />
      ) : (
        <Box className={classes.root}>
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <LocalesMenuButton />
          </Box>

          <Box className={classes.mainContent}>
            <img src="/logo-transparent.png" alt="VoisinApp Logo" className={classes.logo} />

            <Typography variant="h3" component="h1" className={classes.title} gutterBottom>
              {translate('app.welcome')}
            </Typography>

            <Typography className={classes.tagline}>{translate('app.tagline')}</Typography>

            <Box className={classes.featuresSection}>
              <Typography className={classes.featureTitle}>{translate('app.features.title')}</Typography>
              {featureIndices.map(index => (
                <Typography key={index} className={classes.featureList}>
                  • {translate(`app.features.current.${index}`)}
                </Typography>
              ))}

              <Typography className={classes.featureTitle}>{translate('app.features.coming_soon_title')}</Typography>
              {featureIndices.map(index => (
                <Typography key={index} className={classes.featureList}>
                  • {translate(`app.features.coming_soon.${index}`)}
                </Typography>
              ))}
            </Box>

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
          </Box>

          <Box className={classes.warningBanner}>
            <WarningAmberIcon />
            {translate('app.message.early_dev_warning')}{' '}
            <a href="https://github.com/Alice-Po/Voisinapp" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default HomePage;
