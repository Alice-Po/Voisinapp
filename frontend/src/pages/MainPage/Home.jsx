import { CircularProgress, Box } from '@mui/material';
import { useCollection } from '@semapps/activitypub-components';
import { useCheckAuthenticated } from '@semapps/auth-provider';
import ActivityBlock from '../../common/blocks/ActivityBlock/ActivityBlock';
import PostBlock from '../../common/blocks/PostBlock';
import LoadMore from '../../common/LoadMore';
import { useMemo } from 'react';

const Home = () => {
  useCheckAuthenticated();

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
    onError: (error) => {
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
    onError: (error) => {
      console.error('Outbox collection error:', {
        status: error.status,
        message: error.message,
        details: error
      });
    }
  });

  // Combine and sort all activities
  const allActivities = useMemo(() => {
    const combined = [...inboxActivities, ...outboxActivities];
    return combined.sort((a1, a2) => {
      const date1 = new Date(a1.object?.published || a1.published);
      const date2 = new Date(a2.object?.published || a2.published);
      return date2 - date1;
    });
  }, [inboxActivities, outboxActivities]);

  const isLoading = isLoadingInbox || isLoadingOutbox;
  const error = inboxError || outboxError;

  return (
    <div data-testid="unified-feed">
      <PostBlock />
      
      {error && (
        <div style={{ color: 'red', padding: '1rem' }}>
          Error loading messages: {error.message}
        </div>
      )}

      {allActivities.map(activity => (
        <ActivityBlock
          activity={activity}
          key={activity.id}
          showReplies
          onError={(err) => console.error('Activity render error:', err)}
        />
      ))}

      {allActivities.length === 0 && isLoading && (
        <Box height={50} mt={4} mb={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

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
  );
};

export default Home; 