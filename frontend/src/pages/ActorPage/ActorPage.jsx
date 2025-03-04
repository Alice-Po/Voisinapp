import { useEffect, useState } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import { Box, Container, Grid, Hidden, Button } from '@mui/material';
import { useWebfinger } from '@semapps/activitypub-components';
import { useTranslate } from 'react-admin';
import useActor from '../../hooks/useActor';
import ActorContext from '../../contexts/ActorContext';
import ProfileCard from '../../common/cards/ProfileCard';
import Hero from './Hero';
import SubBar from './SubBar';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ActorPage = () => {
  const { username } = useParams();
  const [actorUri, setActorUri] = useState();
  const webfinger = useWebfinger();
  const theme = useTheme();
  const navigate = useNavigate();
  const translate = useTranslate();

  useEffect(() => {
    (async () => {
      if (username.startsWith('http')) {
        // Allow to use the full URI for the username
        setActorUri(username);
      } else {
        const actorUri = await webfinger.fetch(username);
        setActorUri(actorUri);
      }
    })();
  }, [webfinger, username, setActorUri]);

  const actor = useActor(actorUri);

  if (!actor.name) return null;

  return (
    <ActorContext.Provider value={actor}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/local')}
            startIcon={<ArrowBackIcon />}
            sx={{
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
              fontWeight: 500,
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                borderColor: theme.palette.primary.main,
                borderWidth: 2
              }
            }}
          >
            {translate('app.page.local_feed')}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/public')}
            startIcon={<ArrowBackIcon />}
            sx={{
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
              fontWeight: 500,
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                borderColor: theme.palette.primary.main,
                borderWidth: 2
              }
            }}
          >
            {translate('app.page.public_feed')}
          </Button>
        </Box>
      </Container>
      <Hero />
      <SubBar />
      <Box marginTop={3}>
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item sm={8} xs={12}>
              <Box
                sx={{
                  '[data-testid="activity-block"]:first-of-type .MuiCard-root': {
                    borderTopLeftRadius: theme.radius.card,
                    borderTopRightRadius: theme.radius.card
                  }
                }}
              >
                <Outlet />
              </Box>
            </Grid>
            <Hidden smDown>
              <Grid item sm={4}>
                <StickyBox offsetTop={24}>
                  <ProfileCard />
                </StickyBox>
              </Grid>
            </Hidden>
          </Grid>
        </Container>
      </Box>
    </ActorContext.Provider>
  );
};

export default ActorPage;
