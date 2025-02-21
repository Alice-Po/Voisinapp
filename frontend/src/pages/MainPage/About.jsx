import { Box, Typography, Card } from '@mui/material';
import { useTranslate } from 'react-admin';
import { useTheme } from '@mui/material/styles';

const About = () => {
  const translate = useTranslate();
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.paper,
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: 'none',
        borderRadius: '12px'
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 2
        }}
      >
        {translate('app.page.about')}
      </Typography>

      <Box sx={{ color: theme.palette.text.secondary }}>
        <Typography paragraph>
          VoisinApp est une application de réseau social local qui permet aux habitants d'une zone géographique de
          communiquer, partager et s'entraider. Elle s'inspire des groupes locaux de messagerie instantanée comme Signal
          ou WhatsApp mais dépassent leur limitation, comme la modération centralisée des canaux, l'absece de
          considarion géographique, la non-persistance et la non structuration des messages.
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mt: 3,
            mb: 1
          }}
        >
          Fonctionnalités principales
        </Typography>

        <Typography component="div">
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              Publiez des messages depuis votre adresse déclarée avec une portée géographique (actualités, événements,
              partage de biens, services, etc.)
            </li>
            <li>Structurez vos messages avec des tags liés à vos messages (ex: événements, biens, services, etc.)</li>
            <li>Suivez les messages des autres utilisateurs dans votre zone géographique</li>
            <li>Compatibilité avec le Fediverse</li>
          </ul>
        </Typography>
      </Box>
    </Card>
  );
};

export default About;
