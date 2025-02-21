import React, { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { stringToColor, getInitials } from '../../utils/stringUtils';

const UserAvatar = React.memo(({ src, name, size = 150 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (src) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
      img.src = src;
    }
  }, [src]);

  // Générer une couleur stable basée sur le nom
  const backgroundColor = name ? stringToColor(name) : 'grey';

  // Si pas d'image ou erreur, afficher les initiales
  if (!src || imageError) {
    return (
      <Avatar
        sx={{
          width: size,
          height: size,
          bgcolor: backgroundColor,
          fontSize: size / 3
        }}
      >
        {name ? getInitials(name) : '?'}
      </Avatar>
    );
  }

  // Si l'image est en cours de chargement, afficher les initiales
  if (!imageLoaded) {
    return (
      <Avatar
        sx={{
          width: size,
          height: size,
          bgcolor: backgroundColor,
          fontSize: size / 3
        }}
      >
        {name ? getInitials(name) : '?'}
      </Avatar>
    );
  }

  // Image chargée avec succès
  return (
    <Avatar
      src={src}
      alt={name}
      sx={{
        width: size,
        height: size,
        bgcolor: 'grey'
      }}
    />
  );
});

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
