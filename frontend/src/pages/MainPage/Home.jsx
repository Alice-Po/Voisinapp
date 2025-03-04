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
import { Box, Typography, Card, Avatar, InputBase, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslate } from 'react-admin';
import { sortActivitiesByDate } from '../../utils/sorting';

const Home = () => {
  useCheckAuthenticated();
  const actor = useActorContext();
  const [locationData, setLocationData] = useState(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [hasCheckedLocation, setHasCheckedLocation] = useState(false);
  const [hasSetLocation, setHasSetLocation] = useState(localStorage.getItem('hasSetLocation') === 'true');
  const theme = useTheme();
  const translate = useTranslate();

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
    if (!locationData) {
      return [];
    }
    const filteredInboxActivities = filterNotesByLocation(inboxActivities, locationData);
    const filteredOutboxActivities = filterNotesByLocation(outboxActivities, locationData);
    const combined = [...filteredInboxActivities, ...filteredOutboxActivities].sort(sortActivitiesByDate);

    return combined;
  }, [inboxActivities, outboxActivities, locationData]);

  useEffect(() => {
    const checkLocation = async () => {
      if (actor && !actor.isLoading && !hasCheckedLocation) {
        if (actor.profile?.['vcard:hasGeo']) {
          const geo = actor.profile['vcard:hasGeo'];
          const geoData = await reverseGeocode(geo['vcard:latitude'], geo['vcard:longitude']);

          setLocationData({
            ...geoData,
            latitude: geo['vcard:latitude'],
            longitude: geo['vcard:longitude']
          });

          // Store that the user has set their location
          localStorage.setItem('hasSetLocation', 'true');
        } else {
          const hasSeenLocationDialog = localStorage.getItem('hasSeenLocationDialog');
          const hasSetLocation = localStorage.getItem('hasSetLocation');

          // Only show the dialog if the user hasn't set location and hasn't seen the dialog
          if (!hasSeenLocationDialog && !hasSetLocation) {
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
    setShowLocationDialog(false);
    localStorage.setItem('hasSeenLocationDialog', 'true');
  };

  // Reset hasSetLocation when location is removed
  useEffect(() => {
    if (actor && !actor.isLoading && !actor.profile?.['vcard:hasGeo']) {
      localStorage.removeItem('hasSetLocation');
      setLocationData(null); // Explicitly set locationData to null when location is removed
    }
  }, [actor]);

  // Update hasSetLocation when locationData changes
  useEffect(() => {
    setHasSetLocation(localStorage.getItem('hasSetLocation') === 'true');
  }, [locationData]);

  const isLoading = isLoadingInbox || isLoadingOutbox;
  const error = inboxError || outboxError;

  return (
    <div data-testid="unified-feed">
      <PostBlock locationData={locationData} />

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
            {!locationData && !hasSetLocation
              ? translate('app.message.no_location_set')
              : translate('app.message.geographic_info')}
          </Typography>
        </Box>
        {locationData && allActivities && allActivities.length > 0 ? (
          allActivities.map(activity => (
            <ActivityBlock
              activity={activity}
              key={activity.id}
              showReplies
              onError={err => console.error('Activity render error:', err)}
            />
          ))
        ) : locationData && !isLoading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {translate('app.message.no_messages_in_radius')}
            </Typography>
          </Box>
        ) : null}

        {(!allActivities || allActivities.length === 0) && isLoading && <LoadingFeed />}

        {locationData && (hasNextInbox || hasNextOutbox) && (
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
