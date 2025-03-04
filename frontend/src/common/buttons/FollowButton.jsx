import { useCallback, useMemo, useEffect, useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNotify, useTranslate } from 'react-admin';
import { useOutbox, useCollection, ACTIVITY_TYPES } from '@semapps/activitypub-components';
import RippleLoader from '../components/RippleLoader';
import CheckIcon from '@mui/icons-material/Check';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

/**
 * FollowButton Component
 *
 * A button component that handles following/unfollowing actors in the fediverse.
 *
 * DEMO FEATURE:
 * This component includes a special demonstration feature that automatically imports
 * the last 50 posts from a newly followed actor into the user's feed. This is not
 * standard ActivityPub behavior and is implemented specifically for the VoisinApp demo
 * to showcase the potential of historical content integration.
 *
 * The historical posts import process:
 * 1. When a user follows an actor, we fetch their last 50 posts
 * 2. These posts are then imported into the user's feed with their original publication dates
 * 3. A loading indicator shows the import progress
 *
 * Note: In a production environment, this automatic import might need to be:
 * - Made optional
 * - Limited in scope
 * - Implemented differently to respect ActivityPub standards
 * - Or removed entirely depending on privacy and scaling considerations
 *
 * @param {string} actorUri - The URI of the actor to follow/unfollow
 * @param {Object} rest - Additional props to pass to the Button component
 */
const FollowButton = ({ actorUri, children, ...rest }) => {
  const outbox = useOutbox();
  const notify = useNotify();
  const translate = useTranslate();
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historicalPosts, setHistoricalPosts] = useState([]);
  const [injectionProgress, setInjectionProgress] = useState(0);

  const { items: following, error: followingError } = useCollection('following', {
    liveUpdates: true,
    onError: error => {}
  });

  const isFollowing = useMemo(() => following?.includes(actorUri), [following, actorUri]);

  const preparePostForInjection = (post, originalActor) => {
    // Ensure we have the basic structure
    const preparedPost = {
      type: ACTIVITY_TYPES.CREATE,
      actor: originalActor,
      object: {
        ...post.object,
        attributedTo: originalActor,
        published: post.object?.published || post.published // Ensure date is preserved in object
      },
      published: post.published || post.object?.published, // Ensure date is preserved at activity level
      context: {
        isHistorical: true,
        originalActorUri: originalActor,
        importedAt: new Date().toISOString(),
        originalPublished: post.published || post.object?.published
      },
      to: [outbox.owner]
    };

    return preparedPost;
  };

  const injectHistoricalPosts = async preparedPosts => {
    try {
      setInjectionProgress(0);

      // Sort posts by date to maintain chronological order
      const sortedPosts = [...preparedPosts].sort((a, b) => {
        const dateA = new Date(a.published || a.object?.published);
        const dateB = new Date(b.published || b.object?.published);
        return dateA - dateB;
      });

      // Inject posts one by one to maintain order
      for (let i = 0; i < sortedPosts.length; i++) {
        const post = sortedPosts[i];
        try {
          // Create a historical activity that preserves the original date
          const activity = {
            type: ACTIVITY_TYPES.CREATE,
            actor: outbox.owner,
            object: {
              ...post.object,
              type: 'Note',
              attributedTo: post.actor,
              published: post.published || post.object?.published,
              'dc:created': post.published || post.object?.published
            },
            published: post.published || post.object?.published,
            'dc:created': post.published || post.object?.published,
            context: {
              ...post.context,
              isHistorical: true,
              originalActorUri: post.actor,
              originalPublished: post.published || post.object?.published,
              importedAt: new Date().toISOString()
            },
            to: [outbox.owner]
          };

          await outbox.post(activity);

          setInjectionProgress(Math.round(((i + 1) / sortedPosts.length) * 100));
        } catch (error) {
          // Continue with next post even if one fails
        }
      }

      notify('app.notification.historical_posts_imported', { type: 'success' });
    } catch (e) {
      notify('app.notification.historical_posts_import_error', { type: 'error' });
    } finally {
      setInjectionProgress(0);
    }
  };

  const fetchHistoricalPosts = async actorUri => {
    try {
      setIsLoadingHistory(true);

      // Construct the outbox URL
      const outboxUrl = `${actorUri}/outbox`;

      // Fetch the actor's outbox collection
      const response = await fetch(outboxUrl);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch outbox: ${response.statusText} - ${errorText}`);
      }

      const outboxData = await response.json();

      // Get the first page of activities
      const firstPageResponse = await fetch(outboxData.first);

      if (!firstPageResponse.ok) {
        const errorText = await firstPageResponse.text();
        throw new Error(`Failed to fetch first page: ${firstPageResponse.statusText} - ${errorText}`);
      }

      const firstPageData = await firstPageResponse.json();

      // Get up to 50 most recent items and prepare them
      const recentItems = firstPageData.orderedItems.slice(0, 50).map(post => preparePostForInjection(post, actorUri));

      // Store the prepared posts and inject them
      setHistoricalPosts(recentItems);
      await injectHistoricalPosts(recentItems);

      notify('app.notification.historical_posts_fetched', { type: 'success' });
      return recentItems;
    } catch (e) {
      notify('app.notification.historical_posts_error', { type: 'error' });
      throw e;
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const follow = useCallback(async () => {
    try {
      const followRequest = {
        type: ACTIVITY_TYPES.FOLLOW,
        actor: outbox.owner,
        object: actorUri,
        to: actorUri
      };

      const response = await outbox.post(followRequest);

      notify('app.notification.actor_followed', { type: 'success' });

      // After successful follow, fetch and inject historical posts
      await fetchHistoricalPosts(actorUri);
    } catch (e) {
      notify(e.message, { type: 'error' });
    }
  }, [actorUri, outbox, notify]);

  const unfollow = useCallback(async () => {
    try {
      await outbox.post({
        type: ACTIVITY_TYPES.UNDO,
        actor: outbox.owner,
        object: {
          type: ACTIVITY_TYPES.FOLLOW,
          object: actorUri
        },
        to: actorUri
      });
      notify('app.notification.actor_unfollowed', { type: 'success' });
    } catch (e) {
      notify(e.message, { type: 'error' });
    }
  }, [actorUri, outbox, notify]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: 36, position: 'relative' }}>
      {isLoadingHistory ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: 100,
            height: '100%',
            position: 'absolute',
            right: 0,
            top: -2
          }}
        >
          <RippleLoader size={24} />
          {injectionProgress > 0 && (
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{
                whiteSpace: 'nowrap',
                fontSize: '0.75rem'
              }}
            >
              {translate('app.message.importing_posts', { progress: injectionProgress })}
            </Typography>
          )}
        </Box>
      ) : (
        <Button
          variant={isFollowing ? 'outlined' : 'contained'}
          color={isFollowing ? 'secondary' : 'primary'}
          onClick={isFollowing ? unfollow : follow}
          startIcon={isFollowing ? <CheckIcon /> : <PersonAddIcon />}
          sx={{
            ...rest.sx,
            textTransform: 'none',
            fontWeight: isFollowing ? 500 : 600,
            fontSize: '0.875rem',
            px: 2,
            minHeight: 36,
            minWidth: 110,
            boxShadow: isFollowing ? 'none' : undefined,
            borderColor: isFollowing ? 'rgba(0, 0, 0, 0.23)' : undefined,
            color: isFollowing ? 'text.primary' : undefined,
            '&:hover': {
              backgroundColor: isFollowing ? 'rgba(0, 0, 0, 0.04)' : undefined,
              borderColor: isFollowing ? 'rgba(0, 0, 0, 0.23)' : undefined
            }
          }}
          {...rest}
        >
          {translate(isFollowing ? 'app.action.unfollow' : 'app.action.follow')}
        </Button>
      )}
    </Box>
  );
};

export default FollowButton;
