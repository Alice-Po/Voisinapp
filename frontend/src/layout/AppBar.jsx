import { Link } from 'react-router-dom';
import { AppBar as MuiAppBar, Toolbar, Container, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { UserMenu } from '@activitypods/react';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: theme.palette.background.paper,
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
  const theme = useTheme();

  return (
    <MuiAppBar position="sticky" sx={{ flexGrow: 1 }} elevation={0} className={classes.appBar} color="transparent">
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ minHeight: '60px' }}>
          <Link to="/inbox">
            <img src="/logo-transparent.png" alt="VoisinApp Logo" className={classes.logo} />
          </Link>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              marginLeft: 1,
              fontWeight: 600,
              '& a': {
                color: theme.palette.text.primary,
                textDecoration: 'none'
              }
            }}
          >
            <Link to="/home">VoisinApp</Link>
          </Typography>
          <UserMenu
            buttonProps={{
              sx: {
                color: theme.palette.text.primary
              }
            }}
            sx={{
              '& .MuiButton-root': {
                color: theme.palette.text.primary
              },
              '& .MuiSvgIcon-root': {
                color: theme.palette.text.primary
              }
            }}
          />
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
};

export default AppBar;
