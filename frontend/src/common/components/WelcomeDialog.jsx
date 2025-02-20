import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';
import EmailIcon from '@mui/icons-material/Email';

const WelcomeDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
          color: '#543F2E'
        }}
      >
        Bienvenue sur VoisinApp - Preuve de Concept
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Typography variant="body1" sx={{ mb: 3 }}>
          VoisinApp est une démonstration technique issue de 4 années d'étude des réseaux de voisinage sur Signal,
          WhatsApp et Telegram. Notre objectif est de combiner les meilleures pratiques observées tout en surmontant les
          limitations identifiées.
        </Typography>

        <Typography variant="h6" sx={{ mb: 2, color: '#543F2E', fontWeight: 600 }}>
          À propos de cette démonstration
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Cette preuve de concept restera en ligne jusqu'au 21 février 2026. Elle vise à :
        </Typography>
        <Box component="ul" sx={{ mb: 3 }}>
          <Typography component="li" sx={{ mb: 1 }}>
            • Démontrer la faisabilité technique du projet
          </Typography>
          <Typography component="li" sx={{ mb: 1 }}>
            • Recueillir les retours des utilisateurs
          </Typography>
          <Typography component="li" sx={{ mb: 1 }}>
            • Explorer des pistes pour un modèle économique viable
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ mb: 2, color: '#543F2E', fontWeight: 600 }}>
          Contribuer au projet
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Link
            href="https://github.com/Alice-Po/Voisinapp/issues"
            target="_blank"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#543F2E' }}
          >
            <GitHubIcon /> Signaler un bug ou proposer une amélioration
          </Link>
          <Link
            href="https://article-a-definir.com"
            target="_blank"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#543F2E' }}
          >
            <ArticleIcon /> En savoir plus sur le projet
          </Link>
          <Link
            href="mailto:alice.poggioli@assemblee-virtuelle.org"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#543F2E' }}
          >
            <EmailIcon /> Nous contacter
          </Link>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)', px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#543F2E',
            color: 'white',
            '&:hover': {
              backgroundColor: '#A78464'
            },
            textTransform: 'none',
            borderRadius: '8px',
            px: 3
          }}
        >
          J'ai compris, continuer vers VoisinApp
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeDialog;
