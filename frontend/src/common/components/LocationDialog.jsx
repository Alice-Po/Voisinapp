import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, Link } from '@mui/material';
import { useTranslate } from 'react-admin';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import urlJoin from 'url-join';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

const LocationDialog = ({ open, onClose }) => {
  const translate = useTranslate();
  const [error, setError] = useState(null);
  const theme = useTheme();

  const handleOpenPodSettings = () => {
    try {
      const podProviderUrl = import.meta.env.VITE_POD_PROVIDER_BASE_URL_FRONT;

      if (!podProviderUrl) {
        setError('Pod provider URL is not configured');
        return;
      }

      const settingsUrl = urlJoin(podProviderUrl, 'settings', 'profiles', 'private');

      const newWindow = window.open(settingsUrl, '_blank');
      if (newWindow === null) {
        setError('Popup was blocked. Please allow popups for this site.');
      }
    } catch (err) {
      setError('Failed to open settings: ' + err.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px'
        }
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          fontSize: '1.5rem',
          fontWeight: 600,
          color: theme.palette.primary.main
        }}
      >
        {translate('app.location_dialog.title')}
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <LocationOnIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
          <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            {translate('app.location_dialog.subtitle')}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {translate('app.location_dialog.description')}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {translate('app.location_dialog.privacy_note')}
        </Typography>

        {error && (
          <Typography
            color="error"
            sx={{
              mb: 2,
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              padding: '8px 16px',
              borderRadius: '4px'
            }}
          >
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={handleOpenPodSettings}
          sx={{
            mt: 2,
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.light
            }
          }}
        >
          {translate('app.location_dialog.set_location_button')}
        </Button>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)', px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#543F2E',
            '&:hover': {
              backgroundColor: 'rgba(84, 63, 46, 0.04)'
            }
          }}
        >
          {translate('app.location_dialog.skip_button')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationDialog;
