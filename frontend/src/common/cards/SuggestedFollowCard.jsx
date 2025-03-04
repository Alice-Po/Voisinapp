import { useTranslate } from 'react-admin';
import { Box, Typography, Avatar, Chip, Skeleton, CircularProgress, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCollection } from '@semapps/activitypub-components';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import suggestedActorsConfig from '../../config/suggested-actors.json';
import FollowButton from '../buttons/FollowButton';
import { useMemo } from 'react';

const SuggestedFollowCard = () => {
  const translate = useTranslate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get the following collection to determine the number of subscriptions
  const { items: following, loading: followingLoading } = useCollection('following', {
    liveUpdates: true,
    onError: error => console.error('Following collection error:', error)
  });

  // Count of subscriptions
  const followingCount = following?.length || 0;

  // Process all actor URIs once using useMemo
  const processedActors = useMemo(() => {
    return suggestedActorsConfig.actors.map(actor => {
      let actorUri = null;

      // If a direct URI is provided and useDirectUri is enabled, use it
      if (actor.uri && suggestedActorsConfig.config?.useDirectUri) {
        actorUri = actor.uri;
      } else if (actor.handle) {
        // Extract username from handle (format: @username@domain)
        const username = actor.handle.replace(/^@/, '').split('@')[0];

        // Get the base URL and path format from config
        const baseUrl = suggestedActorsConfig.config?.baseUrl || import.meta.env.VITE_POD_PROVIDER_BASE_URL;
        const actorPathFormat = suggestedActorsConfig.config?.actorPathFormat || '/{username}';

        // Construct the URI
        const actorPath = actorPathFormat.replace('{username}', username);
        actorUri = `${baseUrl}${actorPath}`;
      }

      return {
        ...actor,
        processedUri: actorUri
      };
    });
  }, []); // Empty dependency array since suggestedActorsConfig is imported

  // If loading, show a loading state
  if (followingLoading) {
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          p: isMobile ? 2 : 3,
          mb: 2,
          mt: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px'
        }}
      >
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          {translate('app.card.suggested_follow.loading')}
        </Typography>
      </Box>
    );
  }

  // If more than 10 subscriptions, don't show the component
  if (followingCount > 3) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        p: isMobile ? 2 : 3,
        mb: 2,
        mt: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}
    >
      {followingCount === 0 ? (
        // Warm and explanatory message for 0 subscriptions
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <EmojiPeopleIcon
              sx={{
                color: theme.palette.primary.main,
                fontSize: isMobile ? '1.8rem' : '2rem',
                mr: 2,
                mb: isMobile ? 1 : 0
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontSize: isMobile ? '1.1rem' : '1.2rem',
                fontWeight: 600,
                color: theme.palette.primary.main,
                lineHeight: 1.2,
                width: isMobile ? '100%' : 'auto'
              }}
            >
              {translate('app.card.suggested_follow.welcome_title')}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: 'text.secondary',
              lineHeight: 1.5,
              fontSize: isMobile ? '0.9rem' : '0.95rem'
            }}
          >
            {translate('app.card.suggested_follow.welcome_text')}
          </Typography>
        </>
      ) : (
        // More neutral message for 1-10 subscriptions
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <PeopleAltIcon
              sx={{
                color: theme.palette.secondary.main,
                fontSize: isMobile ? '1.6rem' : '1.8rem',
                mr: 2,
                mb: isMobile ? 1 : 0
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: 600,
                color: theme.palette.secondary.main,
                width: isMobile ? 'auto' : 'auto'
              }}
            >
              {translate('app.card.suggested_follow.expand_network_title')}
            </Typography>
            <Chip label={followingCount} size="small" color="secondary" sx={{ ml: 2, fontWeight: 'bold' }} />
          </Box>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: 'text.secondary',
              lineHeight: 1.5,
              fontSize: isMobile ? '0.8rem' : '0.875rem'
            }}
          >
            {translate('app.card.suggested_follow.following_text', {
              count: followingCount,
              plural: followingCount > 1 ? 's' : ''
            })}
          </Typography>
        </>
      )}

      <Typography
        variant="subtitle1"
        sx={{
          mb: 2,
          fontWeight: 500,
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          pb: 1,
          fontSize: isMobile ? '0.9rem' : '1rem'
        }}
      >
        {translate('app.card.suggested_follow.suggestions_title')}
      </Typography>

      {processedActors.map(actor => (
        <Box
          key={actor.processedUri || actor.handle}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            p: isMobile ? 1.5 : 2,
            backgroundColor: theme.palette.background.default,
            borderRadius: '12px',
            mb: 1.5,
            transition: 'all 0.2s ease',
            flexDirection: isMobile ? 'column' : 'row',
            '&:hover': {
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: isMobile ? 'center' : 'flex-start',
              width: '100%',
              mb: isMobile ? 1 : 0
            }}
          >
            <Avatar
              src={actor.avatar}
              alt={actor.name}
              sx={{
                width: isMobile ? 40 : 50,
                height: isMobile ? 40 : 50,
                mr: 2,
                border: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexDirection: isMobile ? 'column' : 'row'
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: isMobile ? '0.9rem' : '0.95rem' }}>
                    {actor.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontSize: isMobile ? '0.8rem' : '0.85rem' }}
                  >
                    {actor.handle}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      fontSize: isMobile ? '0.8rem' : '0.9rem'
                    }}
                  >
                    {actor.description}
                  </Typography>
                </Box>
                {actor.processedUri && (
                  <FollowButton
                    actorUri={actor.processedUri}
                    sx={{
                      borderRadius: theme.radius?.button || '20px',
                      fontSize: isMobile ? '0.8rem' : 'inherit'
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SuggestedFollowCard;
