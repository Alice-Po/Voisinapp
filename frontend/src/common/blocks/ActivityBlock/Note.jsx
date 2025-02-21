import { useMemo, useEffect, useState } from 'react';
import isObject from 'isobject';
import { Box, Avatar, Typography, MenuItem, useTheme } from '@mui/material';
import { Link, useTranslate, useGetIdentity } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import LikeButton from '../../buttons/LikeButton';
import BoostButton from '../../buttons/BoostButton';
import ReplyButton from '../../buttons/ReplyButton';
import RelativeDate from '../../RelativeDate';
import useActor from '../../../hooks/useActor';
import { arrayOf } from '../../../utils';
import MoreButton from '../../buttons/MoreButton';
import { LocationOnOutlined } from '@mui/icons-material';
import TagDisplay from '../../components/TagDisplay';

const mentionRegex = /\<a href="([^"]*)" class=\"[^"]*?mention[^"]*?\">@\<span>(.*?)\<\/span>\<\/a\>/gm;

// Liste de couleurs vives pour les noms d'utilisateurs
const userColors = [
  '#FF1493', // Deep Pink
  '#9400D3', // Dark Violet
  '#4B0082', // Indigo
  '#FF4500', // Orange Red
  '#32CD32', // Lime Green
  '#FF8C00', // Dark Orange
  '#8A2BE2', // Blue Violet
  '#DC143C', // Crimson
  '#FF69B4', // Hot Pink
  '#4169E1', // Royal Blue
  '#008B8B', // Dark Cyan
  '#9932CC', // Dark Orchid
];

// Fonction pour générer une couleur cohérente basée sur l'ID de l'utilisateur
const getUserColor = (actorUri) => {
  if (!actorUri) return userColors[0];
  
  // Utiliser les derniers caractères de l'URI comme seed
  const seed = actorUri.split('/').pop()?.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0) || 0;
  
  return userColors[seed % userColors.length];
};

const Note = ({ object, activity, clickOnContent }) => {
  const navigate = useNavigate();
  const translate = useTranslate();
  const { data: identity } = useGetIdentity();
  const actorUri = object?.attributedTo;
  const [locationName, setLocationName] = useState(null);
  const theme = useTheme();

  // Determine if the message is from the current user
  const isOutgoing = actorUri === identity?.id;
  
  // Générer une couleur pour l'utilisateur
  const userColor = useMemo(() => getUserColor(actorUri), [actorUri]);

  // Récupérer le nom de la commune à partir des coordonnées
  useEffect(() => {
    const fetchLocationName = async () => {
      if (object.geoScope) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${object.geoScope.latitude}&lon=${object.geoScope.longitude}&zoom=10&addressdetails=1`
          );
          const data = await response.json();
          setLocationName(data.address.city || data.address.town || data.address.village);
        } catch (error) {
          // Silently fail
        }
      }
    };
    fetchLocationName();
  }, [object.geoScope]);

  const actor = useActor(actorUri);

  const content = useMemo(() => {
    let content = object.content || object.contentMap;

    if (isObject(content)) {
      content = Object.values(content)?.[0];
    }

    const mentions = arrayOf(object.tag || activity?.tag).filter(tag => tag.type === 'Mention');

    if (mentions.length > 0) {
      content = content.replaceAll(mentionRegex, (match, actorUri, actorName) => {
        const mention = mentions.find(mention => mention.name.startsWith(`@${actorName}@`));
        if (mention) {
          return match.replace(actorUri, `/actor/${mention.name}`);
        } else {
          return match;
        }
      });
    }

    return content;
  }, [object, activity]);

  const images = useMemo(() => {
    return arrayOf(object.attachment || object.icon || []);
  }, [object]);

  const onContentClick = e => {
    const link = e.target.closest('a')?.getAttribute('href');
    if (link?.startsWith('/actor/')) {
      e.preventDefault();
      navigate(link);
    }
  };

  const isExpired = object.endTime 
    ? new Date(object.endTime) < new Date() 
    : false;

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOutgoing ? 'flex-end' : 'flex-start',
        mb: 1.5,
        mx: 1,
        maxWidth: '85%',
        alignSelf: isOutgoing ? 'flex-end' : 'flex-start'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: isOutgoing ? 'row-reverse' : 'row',
          gap: 1,
          width: '100%'
        }}
      >
        {!isOutgoing && (
          <Link to={`/actor/${actor?.username}`}>
            <Avatar
              src={actor?.image}
              alt={actor?.name}
              sx={{
                width: 28,
                height: 28,
                mb: 0.5
              }}
            />
          </Link>
        )}

        <Box
          sx={{
            backgroundColor: isOutgoing ? theme.palette.chat.outgoing : theme.palette.chat.incoming,
            color: isOutgoing ? theme.palette.chat.text.outgoing : theme.palette.chat.text.incoming,
            borderRadius: isOutgoing ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            position: 'relative',
            maxWidth: '100%',
            width: 'fit-content',
            boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)',
            wordBreak: 'break-word',
            overflow: 'hidden'
          }}
        >
          {!isOutgoing && (
            <Typography
              variant="subtitle2" 
              sx={{
                color: userColor,
                fontWeight: 600,
                fontSize: '0.8125rem',
                mb: 0.5,
                lineHeight: 1.2,
                px: 1.5,
                pt: 1
              }}
            >
              <Link to={`/actor/${actor?.username}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {actor?.name}
              </Link>
            </Typography>
          )}

          {images.length > 0 && (
            <Box sx={{ width: '100%', mb: images.length > 0 ? 0 : 1 }}>
              {images.map((image, index) => (
                <Box
                  key={image.url}
                  sx={{
                    width: '100%',
                    marginBottom: index < images.length - 1 ? 1 : 0
                  }}
                >
                  <img
                    src={image.url}
                    alt=""
                    data-testid="note-image"
                    style={{
                      width: '100%',
                      display: 'block',
                      borderRadius: !isOutgoing && index === 0 ? '0 18px 0 0' : '0'
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ p: 1.5 }}>
            <Box
              dangerouslySetInnerHTML={{ __html: content }}
              onClick={clickOnContent ? onContentClick : undefined}
                sx={{ 
                '& a': {
                  color: isOutgoing ? 'inherit' : theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                },
                '& p': {
                  m: 0,
                  fontSize: '0.9375rem',
                  lineHeight: 1.4
                }
              }}
            />

          {object.location && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5,
                  color: isOutgoing ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                  fontSize: '0.75rem'
                }}
              >
                <LocationOnOutlined sx={{ fontSize: '0.875rem' }} />
                {object.location.name} • {object.location.radius}km
            </Box>
          )}

            {object.tag && (Array.isArray(object.tag) ? object.tag.length > 0 : true) && (
              <TagDisplay 
                tags={Array.isArray(object.tag) ? object.tag : [object.tag]} 
                maxDisplay={3}
                isOutgoing={isOutgoing}
              />
            )}

            <Typography 
              variant="caption" 
            sx={{ 
                display: 'block',
              mt: 0.5,
                color: isOutgoing ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                fontSize: '0.6875rem',
                textAlign: isOutgoing ? 'right' : 'left'
              }}
            >
              <RelativeDate date={activity?.published || object?.published} />
              </Typography>
          </Box>
        </Box>
      </Box>

      <Box 
        sx={{ 
          display: 'flex',
          gap: 1,
          mt: 1,
          [isOutgoing ? 'mr' : 'ml']: 3,
          '& .MuiIconButton-root': {
            padding: '4px',
            '& svg': {
              width: '0.9rem',
              height: '0.9rem'
            }
          }
        }}
      >
        <ReplyButton key={`reply-${object.id || activity.id}`} objectUri={object.id || activity.id} />
        <BoostButton key={`boost-${object.id || activity.id}`} activity={activity} object={object} />
        <LikeButton key={`like-${object.id || activity.id}`} activity={activity} object={object} />
        <MoreButton key={`more-${object.id || activity.id}`}>
          <MenuItem onClick={() => {}}>{translate('app.action.unfollow')}</MenuItem>
        </MoreButton>
      </Box>
    </Box>
  );
};

Note.defaultProps = {
  clickOnContent: true
};

export default Note;
