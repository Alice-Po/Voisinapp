import { Box, Card, Typography, Button, Skeleton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useGetIdentity, useTranslate } from 'react-admin';
import { useCollection } from '@semapps/activitypub-components';
import { Link } from 'react-router-dom';
import useActorContext from '../../hooks/useActorContext';
import FollowButton from '../buttons/FollowButton';
import useOpenExternalApp from '../../hooks/useOpenExternalApp';
import { useState, useEffect, useCallback, useRef } from 'react';
import { reverseGeocode } from '../../utils/geocoding';
import RippleLoader from '../components/RippleLoader';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import UserAvatar from '../components/UserAvatar';
import UserName from '../components/UserName';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles(theme => ({
  title: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    color: theme.palette.secondary.contrastText,
    height: 85,
    position: 'relative'
  },
  avatarWrapper: {
    position: 'absolute',
    margin: 10,
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center'
  },
  block: {
    backgroundColor: 'white',
    paddingTop: 80,
    paddingBottom: 20
  },
  button: {
    backgroundColor: 'white',
    textAlign: 'center',
    '& a': {
      textDecoration: 'none'
    }
  },
  status: {
    marginTop: 8,
    color: theme.palette.primary.main
  }
}));

// Cache pour stocker les résultats de géocodage
const geocodeCache = new Map();

const MIN_LOADING_TIME = 500; // Délai minimum de chargement en ms

const ProfileCard = () => {
  const classes = useStyles();
  const { data: identity } = useGetIdentity();
  const actor = useActorContext();
  const translate = useTranslate();
  const openExternalApp = useOpenExternalApp();
  const [reverseGeocodeLocation, setReverseGeocodeLocationLocation] = useState(null);
  const [favoriteAddressFromPods, setFavoriteAddressFromPods] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const loadingTimerRef = useRef(null);
  const theme = useTheme();
  const { totalItems: numFollowers } = useCollection(actor?.followers, { liveUpdates: true });

  const fetchLocation = useCallback(async () => {
    if (!actor?.profile?.['vcard:hasGeo']) return;

    const geo = actor.profile['vcard:hasGeo'];
    const cacheKey = `${geo['vcard:latitude']},${geo['vcard:longitude']}`;

    // Vérifier si le résultat est dans le cache
    if (geocodeCache.has(cacheKey)) {
      setReverseGeocodeLocationLocation(geocodeCache.get(cacheKey));
      return;
    }

    const loadingStartTime = Date.now();
    setIsLoadingLocation(true);

    try {
      const locationData = await reverseGeocode(geo['vcard:latitude'], geo['vcard:longitude']);

      // Mettre en cache le résultat
      geocodeCache.set(cacheKey, locationData);

      // Calculer le temps restant pour atteindre le délai minimum
      const elapsedTime = Date.now() - loadingStartTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

      // Utiliser setTimeout pour assurer un temps de chargement minimum
      loadingTimerRef.current = setTimeout(() => {
        setReverseGeocodeLocationLocation(locationData);
        setIsLoadingLocation(false);
      }, remainingTime);
    } catch (error) {
      console.error('Error fetching location:', error);
      setIsLoadingLocation(false);
    }
  }, [actor?.profile]);

  useEffect(() => {
    fetchLocation();

    // Cleanup function
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [fetchLocation]);

  const isLoading = actor.isLoading;

  return (
    <Card data-testid="profile-card" style={{ borderRadius: theme.radius.card }}>
      <Box className={classes.title}>
        <Box display="flex" justifyContent="center" className={classes.avatarWrapper}>
          <UserAvatar src={actor?.image} name={actor?.name} />
        </Box>
      </Box>
      <Box className={classes.block}>
        <UserName name={actor?.name} />
        <UserName
          name={actor?.username}
          variant="body2"
          sx={{
            color: 'text.secondary',
            mt: 1
          }}
          data-testid="profile-location"
        />

        {/* Followers count */}
        <Box
          component={Link}
          to={actor?.isLoggedUser ? '/followers' : `/actor/${actor?.username}/followers`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 1,
            textDecoration: 'none',
            color: 'text.primary',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
            {numFollowers || 0}
          </Typography>
          <Typography variant="body2" component="span" sx={{ ml: 0.5, color: 'text.secondary' }}>
            {translate('app.page.followers')}
          </Typography>
        </Box>

        {isLoadingLocation ? (
          <Box display="flex" justifyContent="center" py={1}>
            <RippleLoader color={theme.palette.primary.main} />
          </Box>
        ) : (
          reverseGeocodeLocation && (
            <Typography
              align="center"
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                pl: 3,
                pr: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                mt: 1
              }}
            >
              <LocationOnIcon fontSize="small" color="primary" />
              {reverseGeocodeLocation.city}
            </Typography>
          )
        )}
      </Box>

      <Box className={classes.button} pb={3} pr={3} pl={3}>
        {actor.isLoggedUser ? (
          <a href={openExternalApp('as:Profile', identity?.profileData?.id)}>
            <Button variant="contained" color="secondary" type="submit">
              {translate('app.action.edit_profile')}
            </Button>
          </a>
        ) : (
          <FollowButton color="secondary" actorUri={actor?.uri} />
        )}
      </Box>
    </Card>
  );
};

export default ProfileCard;
