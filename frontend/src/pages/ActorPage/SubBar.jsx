import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Container, Tabs, Tab, Box, useMediaQuery } from '@mui/material';
import { useCollection } from '@semapps/activitypub-components';
import useActorContext from '../../hooks/useActorContext';
import { useTranslate } from 'react-admin';
import { useTheme } from '@mui/material/styles';
import ForumIcon from '@mui/icons-material/Forum';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';

const SubBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState(location.pathname);
  const translate = useTranslate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const actor = useActorContext();
  const { totalItems: numFollowers } = useCollection(actor?.followers, { liveUpdates: true });
  const { totalItems: numFollowing } = useCollection(actor?.following, { liveUpdates: true });

  const onChange = (_, v) => {
    navigate(v);
    setTab(v);
  };

  const TabLabel = ({ icon, label, count }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontSize: '0.95rem',
        position: 'relative'
      }}
    >
      {icon}
      {!isMobile && <span>{label}</span>}
      {count !== undefined && (
        <Box
          component="span"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            color: theme.palette.grey[500],
            ml: { xs: 0, sm: 0.5 },
            position: { xs: 'absolute', sm: 'static' },
            top: { xs: -8, sm: 'auto' },
            right: { xs: -8, sm: 'auto' },
            backgroundColor: { xs: theme.palette.grey[200], sm: 'transparent' },
            padding: { xs: '0 6px', sm: 0 },
            borderRadius: { xs: '10px', sm: 0 },
            minWidth: { xs: '16px', sm: 'auto' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          {count}
        </Box>
      )}
    </Box>
  );

  return (
    <AppBar
      position="relative"
      sx={{
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'none',
        zIndex: 900,
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <Container maxWidth="md">
        <Tabs
          value={tab}
          onChange={onChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            '& .MuiTabs-indicator': {
              height: '3px',
              borderRadius: '3px 3px 0 0'
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              minHeight: '48px',
              padding: { xs: '0 24px', sm: '0 16px' },
              color: theme.palette.grey[500],
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.2rem'
              }
            }
          }}
        >
          <Tab
            label={<TabLabel icon={<ForumIcon />} label={translate('app.page.posts')} />}
            value={`/actor/${actor.username}`}
            sx={{ minWidth: 'auto' }}
          />
          <Tab
            label={<TabLabel icon={<QuestionAnswerIcon />} label={translate('app.page.posts_and_replies')} />}
            value={`/actor/${actor.username}/replies`}
            sx={{ minWidth: 'auto' }}
          />
          <Tab
            label={<TabLabel icon={<GroupIcon />} label={translate('app.page.followers')} count={numFollowers} />}
            value={`/actor/${actor.username}/followers`}
            sx={{ minWidth: 'auto' }}
          />
          <Tab
            label={<TabLabel icon={<PersonIcon />} label={translate('app.page.following')} count={numFollowing} />}
            value={`/actor/${actor.username}/following`}
            sx={{ minWidth: 'auto' }}
          />
        </Tabs>
      </Container>
    </AppBar>
  );
};

export default SubBar;
