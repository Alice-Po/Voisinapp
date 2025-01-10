import { CircularProgress, Box } from '@mui/material';
import { useCollection } from '@semapps/activitypub-components';
import { useCheckAuthenticated } from '@semapps/auth-provider';
import ActivityBlock from '../../common/blocks/ActivityBlock/ActivityBlock';
import PostBlock from '../../common/blocks/PostBlock';
import LoadMore from '../../common/LoadMore';
import { useEffect } from 'react';

const Inbox = () => {
  useCheckAuthenticated();
  const {
    items: activities,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error
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

  useEffect(() => {
    console.log('Inbox Debug:', {
      activitiesCount: activities?.length,
      hasNextPage,
      isLoading,
      error
    });
  }, [activities, hasNextPage, isLoading, error]);

  return (
    <div data-testid="inbox-feed">
      <PostBlock />
      {error && (
        <div style={{ color: 'red', padding: '1rem' }}>
          Error loading messages: {error.message}
        </div>
      )}
      {activities?.sort((activite1, activite2) => {
        const dateActivite1 = new Date(activite1.object.published);
        const dateActivite2 = new Date(activite2.object.published);
        return dateActivite2 - dateActivite1;
      }).map(activity => (
        <ActivityBlock 
          activity={activity} 
          key={activity.id}
          onError={(err) => console.error('Activity render error:', err)}
        />
      ))}
      {activities.length === 0 && isLoading && (
        <Box height={50} mt={4} mb={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      {hasNextPage && <LoadMore fetchNextPage={fetchNextPage} isLoading={isFetchingNextPage || isLoading} />}
    </div>
  );
};

export default Inbox;
