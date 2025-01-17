import { Box, Chip, Tooltip } from '@mui/material';
import { memo } from 'react';

// Fonction pour calculer la luminosité d'une couleur
const getLuminance = (hexColor) => {
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  // Formule de luminosité relative (selon WCAG)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

// Fonction pour déterminer la couleur du texte en fonction du fond
const getTextColor = (backgroundColor) => {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

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
      {displayedTags.map((tag) => {
        const backgroundColor = tag['schema:color'] || tag.color || '#e0e0e0';
        const textColor = getTextColor(backgroundColor);
        const displayName = tag['skos:prefLabel'] || tag.prefLabel || tag.name;
        return (
          <Chip
            key={tag.id || displayName}
            label={displayName}
            size="small"
            sx={{
              height: '20px',
              backgroundColor: backgroundColor,
              color: textColor,
              fontSize: '0.75rem',
              fontWeight: 500,
              '& .MuiChip-label': {
                padding: '0 8px'
              }
            }}
          />
        );
      })}
      {hasMoreTags && (
        <Tooltip 
          title={remainingTags.map(tag => tag['skos:prefLabel'] || tag.prefLabel || tag.name).join(', ')}
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