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
        mb: 1,
        mx: 2,
        maxWidth: '80%',
        width: '100%'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'flex-start',
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
                width: 40,
                height: 40
              }}
            />
          </Link>
        )}

        <Box
          sx={{
            backgroundColor: isOutgoing ? theme.palette.chat.outgoing : theme.palette.chat.incoming,
            borderRadius: isOutgoing ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            p: 1.5,
            position: 'relative',
            maxWidth: 'calc(100% - 50px)',
            width: 'fit-content',
            boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)'
          }}
        >
          {!isOutgoing && (
            <Typography
              variant="body2"
              sx={{
                color: userColor,
                fontWeight: 500,
                mb: 0.5,
                fontSize: '0.9375rem'
              }}
            >
              {actor?.name}
            </Typography>
          )}

          {clickOnContent ? (
            <Link 
              to={`/activity/${encodeURIComponent(activity?.id || object.id)}`} 
              onClick={onContentClick}
              sx={{ textDecoration: 'none' }}
            >
              <Typography 
                data-testid="noteContent" 
                sx={{ 
                  color: isOutgoing ? '#FFFFFF' : '#000000',
                  wordBreak: 'break-word',
                  fontSize: '0.9375rem',
                  lineHeight: 1.4
                }} 
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            </Link>
          ) : (
            <Typography 
              sx={{ 
                color: isOutgoing ? '#FFFFFF' : '#000000',
                wordBreak: 'break-word',
                fontSize: '0.9375rem',
                lineHeight: 1.4
              }} 
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          )}

          {images && images.map((image, index) => (
            <img 
              key={`${image?.url}-${index}`}
              data-testid="note-image" 
              src={image?.url} 
              style={{ 
                width: "100%", 
                marginTop: 10,
                borderRadius: 8
              }} 
            />
          ))}

          {object.geoScope && (
            <Typography 
              sx={{ 
                fontSize: 12,
                color: isOutgoing ? 'rgba(255,255,255,0.8)' : 'grey.600',
                mt: 1
              }}
            >
              {`${object.geoScope.radius} km`}
            </Typography>
          )}

          {object.location && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5,
                mb: -0.5
              }}
            >
              <LocationOnOutlined 
                sx={{ 
                  fontSize: 16,
                  color: isOutgoing ? 'rgba(255,255,255,0.8)' : 'grey.600',
                  opacity: 0.8
                }} 
              />
              <Typography 
                sx={{ 
                  fontSize: '0.8125rem',
                  color: isOutgoing ? 'rgba(255,255,255,0.8)' : 'grey.600',
                  opacity: 0.8
                }}
              >
                {object.location.name} • {object.location.radius} km
              </Typography>
            </Box>
          )}

          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              mt: 0.5,
              gap: 1
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              {object.endTime && (
                <Typography 
                  component="span"
                  data-testid="expiration-date"
                  sx={{ 
                    fontSize: '0.8125rem',
                    color: isOutgoing ? 'rgba(255,255,255,0.8)' : 'grey.600',
                    opacity: 0.8
                  }}
                >
                  exp. {new Date(object.endTime).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'numeric'
                  })}
                </Typography>
              )}
              <Typography 
                component="span"
                sx={{ 
                  fontSize: '0.8125rem',
                  color: isOutgoing ? 'rgba(255,255,255,0.8)' : 'grey.600',
                  opacity: 0.8
                }}
              >
                <RelativeDate date={object?.published || object?.["dc:created"] || activity?.published} />
              </Typography>
            </Box>
          </Box>


          {object.tag && (Array.isArray(object.tag) ? object.tag.length > 0 : true) && (
            <>
              <TagDisplay 
                tags={Array.isArray(object.tag) ? object.tag : [object.tag]} 
                maxDisplay={3}
                isOutgoing={isOutgoing}
              />
            </>
          )}
        </Box>
      </Box>

      <Box 
        sx={{ 
          display: 'flex',
          gap: 1,
          mt: 0.5,
          [isOutgoing ? 'mr' : 'ml']: 7
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
