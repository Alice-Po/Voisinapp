import { useMemo, useEffect, useState } from 'react';
import isObject from 'isobject';
import { Box, Avatar, Typography, MenuItem } from '@mui/material';
import { Link, useTranslate } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import LikeButton from '../../buttons/LikeButton';
import BoostButton from '../../buttons/BoostButton';
import ReplyButton from '../../buttons/ReplyButton';
import RelativeDate from '../../RelativeDate';
import useActor from '../../../hooks/useActor';
import { arrayOf } from '../../../utils';
import MoreButton from '../../buttons/MoreButton';

const mentionRegex = /\<a href="([^"]*)" class=\"[^"]*?mention[^"]*?\">@\<span>(.*?)\<\/span>\<\/a\>/gm;

const Note = ({ object, activity, clickOnContent }) => {
  const navigate = useNavigate();
  const translate = useTranslate();
  const actorUri = object?.attributedTo;
  const [locationName, setLocationName] = useState(null);

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

    // If we have a contentMap, take first value
    if (isObject(content)) {
      content = Object.values(content)?.[0];
    }

    // Find all mentions
    const mentions = arrayOf(object.tag || activity?.tag).filter(tag => tag.type === 'Mention');

    if (mentions.length > 0) {
      // Replace mentions to local actor links
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

  // Catch links to actors with react-router
  const onContentClick = e => {
    const link = e.target.closest('a')?.getAttribute('href');
    if (link?.startsWith('/actor/')) {
      e.preventDefault();
      navigate(link);
    }
  };

  // Check if the note is expired
   const isExpired = object.endTime 
   ? new Date(object.endTime) < new Date() 
   : false;

  //  if (isExpired) return null;

  return (
    <>
      <Box pl={8} sx={{ position: 'relative' }}>
        <Link to={`/actor/${actor?.username}`}>
          <Avatar
            src={actor?.image}
            alt={actor?.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 50,
              height: 50
            }}
          />
          <Typography
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              color: 'black',
              pr: 8
            }}
          >
            <strong>{actor?.name}</strong>{' '}
            <Typography component="span" sx={{ color: 'grey' }}>
              <em>{actor?.username}</em>
            </Typography>
          </Typography>
        </Link>

{/* why ? */}
        {object?.published && (
          <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
            <RelativeDate date={object?.published} sx={{ fontSize: 13, color: 'grey' }} />
          </Box>
        )}

         {/* Add the created date display */}
         {object["dc:created"] && (
          <Box sx={{ position: 'absolute', top: 10, right: 0 }}>
            <Typography 
              sx={{ 
                fontSize: 13, 
                color: isExpired ? 'red' : 'grey' 
              }}
            >
              {`Created: ${new Date(object["dc:created"]).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}`}
            </Typography>
          </Box>
        )}

         {/* Add tag display */}
         {object.tag && arrayOf(object.tag).map((tag, index) => (
          <Typography key={index} component="span" sx={{ color: 'blue', marginRight: 1 }}>
            <em>{tag.name || tag.type || JSON.stringify(tag)}</em>
          </Typography>
        ))}
         

        {/* Add expiration date display */}
         {object.endTime && (
          <Box sx={{ position: 'absolute', top: 25, right: 0 }}>
            <Typography 
              sx={{ 
                fontSize: 13, 
                color: isExpired ? 'red' : 'grey' 
              }}
              data-testid="expiration-date"
            >
              {isExpired ? 'Expired' : `Expires: ${new Date(object.endTime).toLocaleDateString()}`}
            </Typography>
          </Box>
        )}

        {clickOnContent ? (
          <Link to={`/activity/${encodeURIComponent(activity?.id || object.id)}`} onClick={onContentClick}>
            <Typography data-testid="noteContent" sx={{ color: 'black' , paddingTop: "15px" }} dangerouslySetInnerHTML={{ __html: content }} />
          </Link>
        ) : (
          <Typography sx={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: content }} />
        )}
        {images && images.map(image => <img data-testid="note-image" src={image?.url} style={{ width: "100%", marginTop: 10 }} />)}

        {/* Display geographic scope */}
        {object.geoScope && (
          <Typography 
            sx={{ 
              fontSize: 13, 
              color: 'grey',
              mt: 1
            }}
          >
            {`${object.geoScope.radius} km`}
          </Typography>
        )}
      </Box>
      <Box pl={8} pt={2} display="flex" justifyContent="space-between">
        <ReplyButton objectUri={object.id || activity.id} />
        <BoostButton activity={activity} object={object} />
        <LikeButton activity={activity} object={object} />
        <MoreButton>
          <MenuItem onClick={() => {}}>{translate('app.action.unfollow')}</MenuItem>
        </MoreButton>
      </Box>
    </>
  );
};

Note.defaultProps = {
  clickOnContent: true
};

export default Note;
