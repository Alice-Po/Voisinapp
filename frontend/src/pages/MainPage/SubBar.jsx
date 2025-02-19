import { useState } from 'react';
import { AppBar, Container, Tabs, Tab, Box, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCollection } from '@semapps/activitypub-components';
import { useTranslate } from 'react-admin';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoIcon from '@mui/icons-material/Info';
import useActorContext from '../../hooks/useActorContext';

const SubBar = () => {
  const location = useLocation();
  const [tab, setTab] = useState(location.pathname);
  const navigate = useNavigate();
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
            color: '#65676B',
            ml: { xs: 0, sm: 0.5 },
            position: { xs: 'absolute', sm: 'static' },
            top: { xs: -8, sm: 'auto' },
            right: { xs: -8, sm: 'auto' },
            backgroundColor: { xs: '#E4E6EB', sm: 'transparent' },
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
        backgroundColor: '#FFFFFF',
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
              color: '#65676B',
              '&.Mui-selected': {
                color: '#2E61D9',
                fontWeight: 600
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.2rem'
              }
            }
          }}
        >
          <Tab
            label={<TabLabel icon={<HomeIcon />} label={translate('app.page.feed')} />}
            value="/home"
            sx={{
              fontWeight: 'normal',
              minWidth: 'auto'
            }}
          />
          <Tab
            label={<TabLabel icon={<PeopleIcon />} label={translate('app.page.followers')} count={numFollowers} />}
            value="/followers"
            sx={{
              fontWeight: 'normal',
              minWidth: 'auto'
            }}
          />
          <Tab
            label={<TabLabel icon={<PersonAddIcon />} label={translate('app.page.following')} count={numFollowing} />}
            value="/following"
            sx={{
              fontWeight: 'normal',
              minWidth: 'auto'
            }}
          />
          <Tab
            label={<TabLabel icon={<InfoIcon />} label={translate('app.page.about')} />}
            value="/about"
            sx={{
              fontWeight: 'normal',
              minWidth: 'auto'
            }}
          />
        </Tabs>
      </Container>
    </AppBar>
  );
};

export default SubBar;
