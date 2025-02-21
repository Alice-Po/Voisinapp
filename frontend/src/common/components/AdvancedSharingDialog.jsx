import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AdvancedSharingDialog = ({ open, onClose }) => {
  const theme = useTheme();

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
          fontSize: '1.1rem',
          fontWeight: 600
        }}
      >
        Fonctionnalité à venir : Partage avancé
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Bientôt, vous pourrez personnaliser finement la diffusion de vos messages :
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" sx={{ mb: 1 }}>
            Partagez avec des contacts spécifiques ou des groupes de contacts de votre carnet d'adresses
          </Typography>
          <Typography component="li" sx={{ mb: 1 }}>
            Créez des cercles d'intimité pour des partages privés (garde d'enfants, prêt de maison...)
          </Typography>
          <Typography component="li" sx={{ mb: 1 }}>
            Communiquez avec des communautés auto-définies (associations, groupes d'intérêt...)
          </Typography>
          <Typography component="li">
            Contrôlez la viralité : choisissez si vos contacts peuvent rediffuser votre message
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Cette fonctionnalité est en cours de développement pour vous offrir une maîtrise totale de la diffusion de vos
          messages.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)', px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark
            },
            textTransform: 'none',
            borderRadius: '8px',
            px: 3
          }}
        >
          J'ai compris
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvancedSharingDialog;
