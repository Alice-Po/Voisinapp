import { useTranslate } from 'react-admin';
import { Box, Avatar, Typography, Chip } from '@mui/material';
import RepeatIcon from '@mui/icons-material/Repeat';
import useActor from '../../../hooks/useActor';

const BoostBanner = ({ activity }) => {
  const actor = useActor(activity.actor || activity.attributedTo);
  const translate = useTranslate()
  const isNearby = activity.object?.location?.radius <= 50;

  return (
    <Box 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        pl: 3,
        pb: 0.5,
        pt: 0.5
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#65676B', flex: 1 }}>
        <Avatar
          src={actor?.image}
          alt={actor?.name}
          sx={{
            width: 14,
            height: 14
          }}
        />
        <Typography 
          sx={{ 
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'inherit'
          }}
        >
          <RepeatIcon sx={{ width: 11, height: 11 }} /> 
          {translate('app.message.actor_boosted', { actor: actor?.name })}
        </Typography>
      </Box>
      
      {isNearby && (
        <Chip
          label="nearby"
          size="small"
          sx={{
            height: 16,
            fontSize: '0.6875rem',
            backgroundColor: '#FFA726',
            color: '#fff',
            '& .MuiChip-label': {
              px: 1
            }
          }}
        />
      )}
    </Box>
  );
};

export default BoostBanner;
