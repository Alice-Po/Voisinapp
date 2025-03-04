import { Box, Typography, Link, Button } from '@mui/material';
import { useTranslate } from 'react-admin';
import { useTheme } from '@mui/material/styles';

const LoadingFeed = () => {
  const translate = useTranslate();
  const theme = useTheme();
  const handleActivityPodsClick = () => {
    window.open('https://activitypods.org/', '_blank');
  };
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
          color: theme.palette.text.primary
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
          color: theme.palette.text.primary
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
            color: theme.palette.text.primary
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
            color: theme.palette.text.primary
          }}
        >
          {translate('app.loading.activitypods_description')}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleActivityPodsClick}
          size="small"
          sx={{
            whiteSpace: 'nowrap',
            textTransform: 'none',
            fontWeight: 500,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2
            }
          }}
        >
          {translate('app.action.learn_more')}
        </Button>
      </Box>
    </Box>
  );
};

export default LoadingFeed;
