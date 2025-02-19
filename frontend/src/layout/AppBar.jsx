import { Link } from 'react-router-dom';
import { AppBar as MuiAppBar, Toolbar, Container, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { UserMenu } from '@activitypods/react';

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: 'none'
  },
  logo: {
    position: 'relative',
    top: 3,
    width: 32,
    marginRight: 5
  }
}));

const AppBar = () => {
  const classes = useStyles();
  return (
    <MuiAppBar position="sticky" sx={{ flexGrow: 1 }} elevation={0} className={classes.appBar}>
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ minHeight: '60px' }}>
          <Link to="/inbox">
            <img src="/logo-transparent.png" className={classes.logo} />
          </Link>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              marginLeft: 1,
              fontWeight: 600,
              '& a': {
                color: '#1c1e21',
                textDecoration: 'none'
              }
            }}
          >
            <Link to="/home">VoisinApp</Link>
          </Typography>
          <UserMenu
            sx={{
              '& .MuiIconButton-root': {
                color: '#65676B',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }
            }}
          />
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
};

export default AppBar;
