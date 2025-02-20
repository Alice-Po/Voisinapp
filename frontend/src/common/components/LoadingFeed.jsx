import { Box, Typography, Link } from '@mui/material';
import { useTranslate } from 'react-admin';

const LoadingFeed = () => {
  const translate = useTranslate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        padding: 3
      }}
    >
      <Box
        sx={{
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          src="/hardwork.gif"
          alt="Loading..."
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontStyle: 'italic',
          marginBottom: 1,
          textAlign: 'center',
          color: 'white'
        }}
      >
        {translate('app.loading.title')}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          marginBottom: 3,
          fontStyle: 'italic',
          lineHeight: 1.6,
          fontSize: '1.1rem',
          color: 'white'
        }}
      >
        {translate('app.loading.feed_loading')}
      </Typography>
      <Box
        sx={{
          maxWidth: '400px',
          textAlign: 'center',
          color: 'white'
        }}
      >
        <Typography
          variant="body2"
          sx={{
            marginBottom: 3,
            fontStyle: 'italic',
            lineHeight: 1.6,
            fontSize: '1.1rem',
            color: 'white'
          }}
        >
          {translate('app.loading.explanation')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 1,
            fontStyle: 'italic',
            lineHeight: 1.6,
            fontSize: '1.1rem',
            color: 'white'
          }}
        >
          {translate('app.loading.activitypods_intro')}{' '}
          <Link
            href="https://activitypods.org"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#A78464',
              textDecoration: 'none',
              borderBottom: '1px solid #A78464',
              '&:hover': {
                color: 'white',
                borderBottomColor: 'white'
              }
            }}
          >
            ActivityPods
          </Link>
          {translate('app.loading.activitypods_description')}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingFeed;
