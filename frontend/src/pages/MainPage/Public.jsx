import { useCollection } from '@semapps/activitypub-components';
import { useCheckAuthenticated } from '@semapps/auth-provider';
import PublicPostBlock from '../../common/blocks/PublicPostBlock';
import LoadMore from '../../common/LoadMore';
import LoadingFeed from '../../common/components/LoadingFeed';
import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslate } from 'react-admin';
import ActivityBlock from '../../common/blocks/ActivityBlock/ActivityBlock';
import SuggestedFollowCard from '../../common/cards/SuggestedFollowCard';
import { sortActivitiesByDate } from '../../utils/sorting';

const Public = () => {
  useCheckAuthenticated();
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
    dereferenceItems: true
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
    dereferenceItems: true
  });

  const allActivities = useMemo(() => {
    // Create a Map to store unique activities by ID
    const uniqueActivities = new Map();

    // Combine and sort all activities
    [...inboxActivities, ...outboxActivities].forEach(activity => {
      uniqueActivities.set(activity.id, activity);
    });

    // Convert Map values to array and sort
    return Array.from(uniqueActivities.values()).sort(sortActivitiesByDate);
  }, [inboxActivities, outboxActivities]);

  const isLoading = isLoadingInbox || isLoadingOutbox;
  const error = inboxError || outboxError;

  return (
    <div data-testid="public-feed">
      <PublicPostBlock />

      <SuggestedFollowCard />

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
            {translate('app.message.public_info')}
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
    </div>
  );
};

export default Public;
