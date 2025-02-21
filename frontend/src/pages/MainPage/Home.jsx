import { useCollection } from '@semapps/activitypub-components';
import { useCheckAuthenticated } from '@semapps/auth-provider';
import useActorContext from '../../hooks/useActorContext';
import ActivityBlock from '../../common/blocks/ActivityBlock/ActivityBlock';
import PostBlock from '../../common/blocks/PostBlock';
import LoadMore from '../../common/LoadMore';
import LoadingFeed from '../../common/components/LoadingFeed';
import LocationDialog from '../../common/components/LocationDialog';
import { useMemo } from 'react';
import { useState, useEffect } from 'react';
import { reverseGeocode } from '../../utils/geocoding';
import { filterNotesByLocation } from '../../utils/geocoding';
import { Box, Typography, Card, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Home = () => {
  useCheckAuthenticated();
  const actor = useActorContext();
  const [locationData, setLocationData] = useState(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [hasCheckedLocation, setHasCheckedLocation] = useState(false);
  const theme = useTheme();

  // Fetch inbox activities
  const {
    items: inboxActivities = [],
    hasNextPage: hasNextInbox,
    fetchNextPage: fetchNextInbox,
    isFetchingNextPage: isFetchingNextInbox,
    isLoading: isLoadingInbox,
    error: inboxError
  } = useCollection('inbox', {
    liveUpdates: true,
    dereferenceItems: true,
    onError: error => {
      console.error('Inbox collection error:', {
        status: error.status,
        message: error.message,
        details: error
      });
    }
  });

  // Fetch outbox activities
  const {
    items: outboxActivities = [],
    hasNextPage: hasNextOutbox,
    fetchNextPage: fetchNextOutbox,
    isFetchingNextPage: isFetchingNextOutbox,
    isLoading: isLoadingOutbox,
    error: outboxError
  } = useCollection('outbox', {
    liveUpdates: true,
    dereferenceItems: true,
    onError: error => {
      console.error('Outbox collection error:', {
        status: error.status,
        message: error.message,
        details: error
      });
    }
  });

  const allActivities = useMemo(() => {
    const filteredInboxActivities = filterNotesByLocation(inboxActivities, locationData);
    const combined = [...filteredInboxActivities, ...outboxActivities].sort((a1, a2) => {
      const date1 = new Date(a1.object?.published || a1.published);
      const date2 = new Date(a2.object?.published || a2.published);
      return date2 - date1;
    });
    return combined;
  }, [inboxActivities, outboxActivities, locationData]);

  useEffect(() => {
    console.log('Location check effect running', {
      actor,
      isLoading: actor?.isLoading,
      hasGeo: actor?.profile?.['vcard:hasGeo'],
      hasCheckedLocation
    });

    const checkLocation = async () => {
      if (actor && !actor.isLoading && !hasCheckedLocation) {
        if (actor.profile?.['vcard:hasGeo']) {
          console.log('User has location, fetching geocode data...');
          const geo = actor.profile['vcard:hasGeo'];
          const geoData = await reverseGeocode(geo['vcard:latitude'], geo['vcard:longitude']);

          setLocationData({
            ...geoData,
            latitude: geo['vcard:latitude'],
            longitude: geo['vcard:longitude']
          });
        } else {
          console.log('No location found, checking if dialog should be shown...');
          const hasSeenLocationDialog = localStorage.getItem('hasSeenLocationDialog');
          console.log('Has seen dialog:', hasSeenLocationDialog);

          if (!hasSeenLocationDialog) {
            console.log('Showing location dialog...');
            setShowLocationDialog(true);
          }
        }

        setHasCheckedLocation(true);
      }
    };

    checkLocation();
  }, [actor, hasCheckedLocation]);

  useEffect(() => {
    if (actor?.isLoading) {
      setHasCheckedLocation(false);
    }
  }, [actor?.isLoading]);

  const handleCloseLocationDialog = () => {
    console.log('Closing location dialog...');
    setShowLocationDialog(false);
    localStorage.setItem('hasSeenLocationDialog', 'true');
  };

  const isLoading = isLoadingInbox || isLoadingOutbox;
  const error = inboxError || outboxError;

  return (
    <div data-testid="unified-feed">
      <PostBlock />

      {error && <div style={{ color: 'red', padding: '1rem' }}>Error loading messages: {error.message}</div>}
      <div
        style={{
          backgroundColor: 'white',
          marginTop: '1rem',
          borderRadius: theme.radius.card,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            px: 2,
            py: 1.5,
            mx: 2,
            my: 1,
            borderLeft: 3,
            borderColor: 'primary.light',
            borderRadius: 0
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: '0.875rem',
              lineHeight: 1.5,
              fontWeight: 400,
              opacity: 0.9
            }}
          >
            📍 Les messages affichés proviennent de votre zone géographique, pour favoriser les échanges de proximité
          </Typography>
        </Box>
        {allActivities &&
          allActivities.map(activity => (
            <ActivityBlock
              activity={activity}
              key={activity.id}
              showReplies
              onError={err => console.error('Activity render error:', err)}
            />
          ))}

        {(!allActivities || allActivities.length === 0) && isLoading && <LoadingFeed />}

        {(hasNextInbox || hasNextOutbox) && (
          <LoadMore
            fetchNextPage={() => {
              if (hasNextInbox) fetchNextInbox();
              if (hasNextOutbox) fetchNextOutbox();
            }}
            isLoading={isFetchingNextInbox || isFetchingNextOutbox || isLoading}
          />
        )}
      </div>

      <LocationDialog open={showLocationDialog} onClose={handleCloseLocationDialog} />
    </div>
  );
};

export default Home;
