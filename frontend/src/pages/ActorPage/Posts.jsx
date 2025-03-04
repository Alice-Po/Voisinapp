import { useCollection } from '@semapps/activitypub-components';
import ActivityBlock from '../../common/blocks/ActivityBlock/ActivityBlock';
import useActorContext from '../../hooks/useActorContext';
import LoadMore from '../../common/LoadMore';
import RippleLoader from '../../common/components/RippleLoader';
import { Box } from '@mui/material';

const Posts = () => {
  const actor = useActorContext();
  const {
    items: activities,
    fetchNextPage,
    isLoading,
    isFetchingNextPage
  } = useCollection(actor?.outbox, { liveUpdates: true });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <RippleLoader />
      </Box>
    );
  }

  return (
    <>
      {activities?.map(activity => (
        <ActivityBlock activity={activity} showReplies={false} key={activity.id} />
      ))}
      <LoadMore fetchNextPage={fetchNextPage} isLoading={isFetchingNextPage || isLoading} />
    </>
  );
};

export default Posts;
