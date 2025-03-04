import { Card, List, CircularProgress, Box } from '@mui/material';
import { useCollection } from '@semapps/activitypub-components';
import ActorItem from './ActorItem';
import LoadMore from '../../common/LoadMore';
import SuggestedFollowCard from '../../common/cards/SuggestedFollowCard';

const Following = () => {
  const {
    items: following,
    fetchNextPage,
    isFetchingNextPage,
    isLoading
  } = useCollection('following', {
    liveUpdates: true,
    onError: error => {} // Silently handle errors
  });

  // Deduplicate the following list to avoid key conflicts
  const uniqueFollowing = [...new Set(following || [])];

  return (
    <>
      <SuggestedFollowCard />

      <Card>
        <List sx={{ p: 0 }}>
          {uniqueFollowing.map((actorUri, index) => (
            <ActorItem actorUri={actorUri} key={`${actorUri}-${index}`} unfollowButton />
          ))}
        </List>
      </Card>
      {uniqueFollowing.length === 0 && isLoading && (
        <Box height={50} mt={4} mb={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      <LoadMore fetchNextPage={fetchNextPage} isLoading={isFetchingNextPage || isLoading} />
    </>
  );
};

export default Following;
