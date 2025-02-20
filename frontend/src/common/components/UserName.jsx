import React from 'react';
import { Typography } from '@mui/material';

const UserName = React.memo(({ name, variant = 'h4', ...props }) => {
  // Si pas de nom, afficher un placeholder élégant
  if (!name) {
    return (
      <Typography
        variant={variant}
        align="center"
        sx={{
          color: 'text.secondary',
          ...props.sx
        }}
      >
        ...
      </Typography>
    );
  }

  return (
    <Typography variant={variant} align="center" {...props}>
      {name}
    </Typography>
  );
});

UserName.displayName = 'UserName';

export default UserName;
