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
    const combined = [...inboxActivities, ...outboxActivities].sort((a1, a2) => {
      const date1 = new Date(a1.object?.published || a1.published);
      const date2 = new Date(a2.object?.published || a2.published);
      return date2 - date1;
    });
    return combined;
  }, [inboxActivities, outboxActivities]);

  const isLoading = isLoadingInbox || isLoadingOutbox;
  const error = inboxError || outboxError;

  return (
    <div data-testid="public-feed">
      <PublicPostBlock />

      {error && <div style={{ color: 'red', padding: '1rem' }}>Error loading messages: {error.message}</div>}

      <div
        style={{
          backgroundColor: 'white',
          marginTop: '1rem',
          borderRadius: theme.radius.card,
          overflow: 'hidden'
        }}
      >
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
