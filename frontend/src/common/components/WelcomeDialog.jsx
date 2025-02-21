import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, Link } from '@mui/material';
import { useTranslate } from 'react-admin';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';
import EmailIcon from '@mui/icons-material/Email';

const WelcomeDialog = ({ open, onClose }) => {
  const translate = useTranslate();

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
        {translate('app.welcome_dialog.title')}
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {translate('app.welcome_dialog.intro')}
        </Typography>

        <Typography variant="h6" sx={{ mb: 2, color: '#543F2E', fontWeight: 600 }}>
          {translate('app.welcome_dialog.about_title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {translate('app.welcome_dialog.about_intro')}
        </Typography>
        <Box component="ul" sx={{ mb: 3 }}>
          <Typography component="li" sx={{ mb: 1 }}>
            {translate('app.welcome_dialog.about_points.0')}
          </Typography>
          <Typography component="li" sx={{ mb: 1 }}>
            {translate('app.welcome_dialog.about_points.1')}
          </Typography>
          <Typography component="li" sx={{ mb: 1 }}>
            {translate('app.welcome_dialog.about_points.2')}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ mb: 2, color: '#543F2E', fontWeight: 600 }}>
          {translate('app.welcome_dialog.contribute_title')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Link
            href="https://github.com/Alice-Po/Voisinapp/issues"
            target="_blank"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#543F2E' }}
          >
            <GitHubIcon /> {translate('app.welcome_dialog.report_issue')}
          </Link>
          <Link
            href="https://article-a-definir.com"
            target="_blank"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#543F2E' }}
          >
            <ArticleIcon /> {translate('app.welcome_dialog.learn_more')}
          </Link>
          <Link
            href="mailto:alice.poggioli@assemblee-virtuelle.org"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#543F2E' }}
          >
            <EmailIcon /> {translate('app.welcome_dialog.contact')}
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
          {translate('app.welcome_dialog.continue')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeDialog;
