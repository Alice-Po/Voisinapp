import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import ImageIcon from '@mui/icons-material/Image';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { formatDateTime } from '../utils/date';

const Note = ({ object, actor, isBoostLoading, isLikeLoading, handleBoost, handleLike }) => {
  const navigate = useNavigate();
  const { t: translate } = useTranslation();

  return (
    <Card sx={{ position: 'relative', mb: 2 }}>
      <CardHeader
        avatar={<Avatar src={actor?.image} />}
        title={actor?.name || actor?.username}
        subheader={
          <Box>
            <Typography variant="body2" color="textSecondary">
              {formatDateTime(object.published)}
            </Typography>
            {object.endTime && (
              <Typography variant="body2" color="textSecondary">
                {translate('app.input.expiration_date')}: {formatDateTime(object.endTime)}
              </Typography>
            )}
            {object.geoScope && (
              <Typography variant="body2" color="textSecondary">
                {translate('app.input.radius')}: {object.geoScope.radius} km
              </Typography>
            )}
          </Box>
        }
        action={
          <Box>
            {object.inReplyTo && (
              <IconButton onClick={() => navigate(`/r/${encodeURIComponent(object.inReplyTo)}`)}>
                <ReplyIcon />
              </IconButton>
            )}
            {object.attachment && (
              <IconButton onClick={() => window.open(object.attachment[0].url, '_blank')}>
                <ImageIcon />
              </IconButton>
            )}
          </Box>
        }
      />
      <CardContent>
        <Typography variant="body1" data-testid="noteContent">
          {object.content}
        </Typography>
        {object.attachment && (
          <Box mt={2}>
            <img src={object.attachment[0].url} alt="Note" style={{ maxWidth: '100%' }} data-testid="note-image" />
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button
          startIcon={<ReplyIcon />}
          onClick={() => navigate(`/r/${encodeURIComponent(object.id)}`)}
        >
          {translate('app.action.reply')}
        </Button>
        <Button
          startIcon={<RepeatIcon />}
          onClick={() => handleBoost()}
          disabled={isBoostLoading}
        >
          {translate('app.action.boost')}
        </Button>
        <Button
          startIcon={<FavoriteIcon />}
          onClick={() => handleLike()}
          disabled={isLikeLoading}
        >
          {translate('app.action.like')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default Note;
