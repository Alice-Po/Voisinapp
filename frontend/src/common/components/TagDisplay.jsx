import { Box, Chip, Tooltip } from '@mui/material';
import { memo } from 'react';

const TagDisplay = ({ tags = [], maxDisplay = 3, isOutgoing = false }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const displayedTags = tags.slice(0, maxDisplay);
  const remainingTags = tags.slice(maxDisplay);
  const hasMoreTags = remainingTags.length > 0;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '4px',
        mt: 0.5
      }}
    >
      {displayedTags.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.prefLabel}
          size="small"
          sx={{
            height: '20px',
            backgroundColor: tag.color || '#e0e0e0',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 500,
            '& .MuiChip-label': {
              padding: '0 8px'
            }
          }}
        />
      ))}
      {hasMoreTags && (
        <Tooltip 
          title={remainingTags.map(tag => tag.prefLabel).join(', ')}
          arrow
        >
          <Chip
            label={`+${remainingTags.length}`}
            size="small"
            sx={{
              height: '20px',
              backgroundColor: isOutgoing ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)',
              color: isOutgoing ? '#fff' : '#666',
              fontSize: '0.75rem',
              fontWeight: 500,
              '& .MuiChip-label': {
                padding: '0 8px'
              }
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};

export default memo(TagDisplay); 